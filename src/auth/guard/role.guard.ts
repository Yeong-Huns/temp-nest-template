import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../role/enum/user-role';
import { Role } from '../decorator/role-based-access-control.decorator';
import { RequestWithToken } from '../types/auth';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext) {
    const role = this.reflector.get<UserRole>(Role, context.getHandler());
    if (!Object.values(UserRole).includes(role)) return true;

    const request = context.switchToHttp().getRequest<RequestWithToken>();
    const user = request.user;
    if (!user) return false;

    const userRoleIndex = this.getEnumIndex(UserRole, role);
    const requiredRoleIndex = this.getEnumIndex(UserRole, role);
    return userRoleIndex <= requiredRoleIndex;
  }

  private getEnumIndex(roleEnum: typeof UserRole, value: string): number {
    const keys = Object.keys(roleEnum).filter((key) => isNaN(Number(key)));
    return keys.indexOf(value);
  }
}
