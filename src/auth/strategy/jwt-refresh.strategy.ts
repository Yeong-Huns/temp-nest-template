import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { RequestWithToken, TokenPayload } from '../types/auth';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: RequestWithToken) => {
          const token = request?.cookies?.refreshToken;
          console.log('refresh-token', token);
          if (!token) return null;
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('REFRESH_TOKEN_SECRET')!,
      passReqToCallback: true /* validate 에서 req 사용하기 위해 true 설정 */,
    });
  }

  validate(req: RequestWithToken, payload: TokenPayload) {
    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('잘못된 토큰 타입입니다.');
    }
    const refreshToken = req.cookies.refreshToken;
    console.log('refresh-strategy: ', { ...payload, refreshToken });
    return { ...payload, refreshToken };
  }
}
