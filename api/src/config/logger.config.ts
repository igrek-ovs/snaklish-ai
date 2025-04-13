import * as winston from 'winston';

export const winstonOptions = {
  transports: [
    new winston.transports.Console({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, context }) => {
          const ctx = context ? ` | ${context}` : '';
          return `[${timestamp}] ${level}: ${message}${ctx}`;
        }),
      ),
    }),
  ],
};
