import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { RequestWithToken, TokenPayload } from '../types/auth';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    super({
      /* Bearer Token 추출 */
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: RequestWithToken) => {
          const token = request?.cookies?.accessToken;
          console.log(token);
          if (!token) return null;
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('ACCESS_TOKEN_SECRET')!,
      passReqToCallback: true,
    });
  }

  validate(req: RequestWithToken, payload: TokenPayload) {
    if (payload.type !== 'access') {
      throw new UnauthorizedException('잘못된 토큰 타입입니다.');
    }
    const accessToken = req.cookies.accessToken;
    console.log({ ...payload, accessToken });
    return { ...payload, accessToken };
  }
}
