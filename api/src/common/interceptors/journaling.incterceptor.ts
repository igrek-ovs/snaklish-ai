import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, catchError, tap } from 'rxjs';
import { Request, Response } from 'express';
import { AuditLogService } from '../../modules/audit-log/audit-log.service';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private readonly auditLogService: AuditLogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    return next.handle().pipe(
      tap(() => {
        const responseTimeMs = Date.now() - now;
        this.auditLogService.create({
          userId: req.user?.id || undefined,
          role: req.user?.role || null,
          ipAddress:
            (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
            req.socket.remoteAddress,
          method: req.method,
          url: req.originalUrl,
          statusCode: res.statusCode,
          responseTimeMs,
          date: new Date(),
          userAgent: req.headers['user-agent'],
          queryParams: req.query,
          body: req.body,
        });
      }),
      catchError((err) => {
        const responseTimeMs = Date.now() - now;
        this.auditLogService.create({
          userId: req.user?.id || undefined,
          role: req.user?.role || null,
          ipAddress:
            (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
            req.socket.remoteAddress,
          method: req.method,
          url: req.originalUrl,
          statusCode: res.statusCode,
          responseTimeMs,
          date: new Date(),
          userAgent: req.headers['user-agent'],
          queryParams: req.query,
          body: req.body,
          errorMessage: err.message,
        });
        throw err;
      }),
    );
  }
}
