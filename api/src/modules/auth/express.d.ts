import { Request as ExpressRequest } from 'express';

declare module 'express' {
  export interface Request extends ExpressRequest {
    user?: {
      id: string;
      role: UserRole;
    };
  }
}
