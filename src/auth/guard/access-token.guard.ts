import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Public } from '../decorator/public.decorator';
import { RefreshAuth } from '../decorator/refresh.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(Public, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const isRefresh = this.reflector.getAllAndOverride<boolean>(RefreshAuth, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isRefresh) {
      return true;
    }

    /* Access Token Guard */
    return super.canActivate(context);
  }
}
