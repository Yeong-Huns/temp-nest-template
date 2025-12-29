import { Reflector } from '@nestjs/core';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export const RefreshAuth = Reflector.createDecorator<boolean>();

export function Refresh() {
  return applyDecorators(RefreshAuth(), UseGuards(AuthGuard('jwt-refresh')));
}
