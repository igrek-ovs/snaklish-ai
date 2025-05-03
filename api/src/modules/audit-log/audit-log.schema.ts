import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AuditLogDocument = AuditLog & Document;

@Schema()
export class AuditLog {
  @Prop()
  userId?: string;

  @Prop()
  role?: string;

  @Prop()
  ipAddress: string;

  @Prop()
  method: string;

  @Prop()
  url: string;

  @Prop()
  statusCode: number;

  @Prop()
  responseTimeMs: number;

  @Prop({ default: Date.now })
  date: Date;

  @Prop()
  userAgent?: string;

  @Prop({ type: Object })
  queryParams?: Record<string, any>;

  @Prop({ type: Object })
  body?: Record<string, any>;

  @Prop()
  errorMessage?: string;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
