import { Injectable } from '@nestjs/common';
import { createReadStream, unlink } from 'fs';
import OpenAI from 'openai';
import { DEFAULT_SYSTEM_PROMPT } from './constants/openai-prompts.constant';
import { ChatMessageService } from './chat-message.service';
import { SenderType } from '../../common/enums/sender-type.enum';
import {
  ChatCompletionMessageParam,
  ChatCompletionUserMessageParam,
  ChatCompletionAssistantMessageParam,
  ChatCompletionSystemMessageParam,
} from 'openai/resources/chat/completions';

@Injectable()
export class OpenaiService {
  private readonly openai: OpenAI;

  constructor(private readonly chatMessageService: ChatMessageService) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async transcribeAudioFromPath(filePath: string): Promise<string> {
    const fileStream = createReadStream(filePath);

    try {
      const transcription = await this.openai.audio.transcriptions.create({
        file: fileStream,
        model: 'whisper-1',
      });
      return transcription.text;
    } finally {
      unlink(filePath, () => {});
    }
  }

  async generateChatResponse(
    userMessage: string,
    extraPrompt?: string,
  ): Promise<string | null> {
    let finalSystemPrompt = DEFAULT_SYSTEM_PROMPT.trim();

    if (extraPrompt && extraPrompt.trim().length > 0) {
      finalSystemPrompt +=
        '\n\nAdditional instructions:\n' + extraPrompt.trim();
    }

    const chatCompletion = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: finalSystemPrompt },
        { role: 'user', content: userMessage },
      ],
    });

    return chatCompletion.choices[0].message.content;
  }

  async generateSpeech(text: string): Promise<Buffer> {
    const response = await this.openai.audio.speech.create({
      model: 'gpt-4o-mini-tts',
      input: text,
      voice: 'alloy', // можешь поменять голос на другой, например: echo, fable, nova, shimmer, onyx
    });

    const buffer = Buffer.from(await response.arrayBuffer());
    return buffer;
  }

  async handleFullVoiceChatFlow(
    filePath: string,
    chatId: number,
    userId: string,
    extraPrompt?: string,
  ): Promise<Buffer> {
    const fileStream = createReadStream(filePath);

    try {
      const transcription = await this.openai.audio.transcriptions.create({
        file: fileStream,
        model: 'whisper-1',
      });
      const userMessage = transcription.text.trim();

      await this.chatMessageService.createMessage(
        chatId,
        userMessage,
        SenderType.USER,
      );

      const history = await this.chatMessageService.getLastMessagesByChat(
        chatId,
        15,
      );

      let finalSystemPrompt = DEFAULT_SYSTEM_PROMPT.trim();
      if (extraPrompt?.trim()) {
        finalSystemPrompt += `\n\nAdditional instructions:\n${extraPrompt.trim()}`;
      }

      const messages: ChatCompletionMessageParam[] = [
        {
          role: 'system',
          content: finalSystemPrompt,
        } as ChatCompletionSystemMessageParam,
        ...history.map(
          (
            msg,
          ):
            | ChatCompletionUserMessageParam
            | ChatCompletionAssistantMessageParam => ({
            role: msg.senderType === SenderType.USER ? 'user' : 'assistant',
            content: msg.content,
          }),
        ),
      ];

      const chatCompletion = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages,
      });

      const aiResponse = chatCompletion.choices[0].message.content?.trim();
      if (!aiResponse) throw new Error('AI response is empty');

      await this.chatMessageService.createMessage(
        chatId,
        aiResponse,
        SenderType.AI,
      );

      const speechResponse = await this.openai.audio.speech.create({
        model: 'gpt-4o-mini-tts',
        input: aiResponse,
        voice: 'alloy',
      });

      return Buffer.from(await speechResponse.arrayBuffer());
    } finally {
      unlink(filePath, () => {});
    }
  }
}
