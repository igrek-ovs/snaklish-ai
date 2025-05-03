import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { GetAuditLogsDto } from './dto/get-audit-logs.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('audit-logs')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('admin')
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  async getAll(@Query() query: GetAuditLogsDto) {
    return this.auditLogService.findAll(query);
  }
}
