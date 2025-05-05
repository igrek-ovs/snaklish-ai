import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Body,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { OpenaiService } from './openai.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiProduces,
  ApiTags,
} from '@nestjs/swagger';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ChatRequestDto } from './dto/chat-request.dto';
import { TtsRequestDto } from './dto/tts-request.dto';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('OpenAI')
@Controller('openai')
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Post('transcribe')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async transcribeAudio(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ transcription: string }> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const transcription = await this.openaiService.transcribeAudioFromPath(
      file.path, // 👈 ТЕПЕРЬ передаём путь файла, а не buffer
    );

    return { transcription };
  }

  @Post('chat')
  @ApiBody({ type: ChatRequestDto })
  async chatWithGpt(
    @Body() body: ChatRequestDto,
  ): Promise<{ chatResponse: string | null }> {
    const chatResponse = await this.openaiService.generateChatResponse(
      body.message,
      body.systemPrompt,
    );
    return { chatResponse };
  }

  @Post('tts')
  @ApiBody({ type: TtsRequestDto })
  @ApiProduces('audio/mpeg')
  async textToSpeech(
    @Body() body: TtsRequestDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const audioBuffer = await this.openaiService.generateSpeech(body.text);

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Disposition': 'attachment; filename="speech.mp3"',
    });

    res.send(audioBuffer);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('user')
  @Post('voice-chat')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        chatId: { type: 'number' },
        extraPrompt: { type: 'string' },
      },
      required: ['file', 'chatId'],
    },
  })
  @ApiProduces('audio/mpeg')
  async handleVoiceChat(
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
    @Body('chatId') chatId: number,
    @Res() res: Response,
    @Body('extraPrompt') extraPrompt?: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const buffer = await this.openaiService.handleFullVoiceChatFlow(
      file.path,
      chatId,
      req.user.id,
      extraPrompt,
    );

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Disposition': 'attachment; filename="response.mp3"',
    });

    res.send(buffer);
  }
}
