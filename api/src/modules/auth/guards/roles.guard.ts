import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Извлекаем требуемые роли, заданные через декоратор @Roles
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) {
      // Если метаданные не заданы, значит, защита роли не требуется
      return true;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      return false;
    }

    // Проверяем, содержит ли роль пользователя одну из требуемых ролей
    return requiredRoles.includes(user.role);
  }
}
