import { Request } from 'express';
import { User } from '../../user/entities/user.entity';
import { Role } from '../../role/entities/role.entity';

export type TokenPayload = {
  id: string;
  role: Pick<Role, 'name'>;
  type: 'access' | 'refresh';
  iat: number;
  exp: number;
};

export interface RequestWithToken extends Request {
  cookies: { refreshToken?: string; accessToken?: string };
  user: TokenPayload;
}

export type UserWithRoleName = Pick<User, 'id'> & {
  role: Pick<Role, 'name'>;
};
