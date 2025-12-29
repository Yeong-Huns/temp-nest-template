import { Reflector } from '@nestjs/core';
import { UserRole } from '../../role/enum/user-role';

export const Role = Reflector.createDecorator<UserRole>();
