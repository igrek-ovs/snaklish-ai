import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { AuditLog, AuditLogDocument } from './audit-log.schema';
import { GetAuditLogsDto } from './dto/get-audit-logs.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuditLogService {
  private readonly logger = new Logger(AuditLogService.name);

  constructor(
    @InjectModel(AuditLog.name)
    private readonly auditLogModel: Model<AuditLogDocument>,
    private readonly userService: UserService,
  ) {}

  async create(logData: Partial<AuditLog>): Promise<void> {
    try {
      const log = new this.auditLogModel(logData);
      await log.save();
      this.logger.log(
        `Audit log created: ${JSON.stringify({
          userId: logData.userId,
          method: logData.method,
          ipAddress: logData.ipAddress,
        })}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to create audit log: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to create audit log');
    }
  }

  async findAll(filters: GetAuditLogsDto): Promise<AuditLog[]> {
    const query: FilterQuery<AuditLogDocument> = {};

    try {
      if (filters.userEmail) {
        const user = await this.userService.getByEmail(filters.userEmail);

        if (user) {
          query.userId = user.id;
          this.logger.log(
            `Filtering audit logs by userEmail: ${filters.userEmail} (userId: ${user.id})`,
          );
        } else {
          this.logger.warn(
            `User with email ${filters.userEmail} not found, returning empty result`,
          );
          return [];
        }
      }

      if (filters.ipAddress) {
        query.ipAddress = { $regex: filters.ipAddress, $options: 'i' };
        this.logger.log(
          `Filtering audit logs by ipAddress: ${filters.ipAddress}`,
        );
      }
      if (filters.method) {
        query.method = { $regex: filters.method, $options: 'i' };
        this.logger.log(`Filtering audit logs by method: ${filters.method}`);
      }
      if (filters.statusCode) {
        query.statusCode = filters.statusCode;
        this.logger.log(
          `Filtering audit logs by statusCode: ${filters.statusCode}`,
        );
      }
      if (filters.dateFrom || filters.dateTo) {
        query.date = {};
        if (filters.dateFrom) {
          query.date.$gte = new Date(filters.dateFrom);
          this.logger.log(
            `Filtering audit logs from date: ${filters.dateFrom}`,
          );
        }
        if (filters.dateTo) {
          query.date.$lte = new Date(filters.dateTo);
          this.logger.log(`Filtering audit logs to date: ${filters.dateTo}`);
        }
      }

      const results = await this.auditLogModel
        .find(query)
        .sort({ date: -1 })
        .exec();

      this.logger.log(`Found ${results.length} audit logs`);
      return results;
    } catch (error) {
      this.logger.error(
        `Failed to fetch audit logs: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to fetch audit logs');
    }
  }
}
