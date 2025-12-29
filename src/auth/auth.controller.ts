import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorator/public.decorator';
import { SignUpDto } from './dto/request/sign-up.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserResponseDto } from '../user/dto/response/user-response.dto';
import { Refresh } from './decorator/refresh.decorator';
import type { RequestWithToken } from './types/auth';
import type { Response } from 'express';
import { SignInDto } from './dto/request/sign-in.dto';

@ApiTags('인증/인가')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: '회원가입',
    description: '새로운 사용자를 등록합니다.',
  })
  @ApiResponse({
    type: UserResponseDto,
    status: 201,
    description: '회원가입 성공 (UserResponseDto 반환)',
  })
  @ApiResponse({
    status: 400,
    description: '입력 데이터 유효성 검사 실패 또는 이메일 중복',
  })
  @Public()
  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @ApiOperation({
    summary: '로그인',
    description: '이메일과 비밀번호로 로그인하고 Access Token을 발급합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '로그인 성공 (Access Token 및 Refresh Token 쿠키 설정)',
  })
  @ApiResponse({ status: 401, description: '인증 실패 (비밀번호 불일치 등)' })
  @Public()
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.signIn(signInDto, res);
  }

  @ApiOperation({
    summary: '로그아웃',
    description:
      '사용자의 Access Token 과 Refresh Token 을 파기하고 로그아웃 처리합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '로그아웃 성공',
  })
  @Public()
  @Post('sign-out')
  @HttpCode(HttpStatus.OK)
  signOut(@Res({ passthrough: true }) res: Response) {
    this.authService.signOut(res);
  }

  @ApiBearerAuth('refresh-token')
  @ApiOperation({
    summary: 'Access Token 재발급',
    description: 'Refresh Token을 사용하여 새로운 Access Token을 발급받습니다.',
  })
  @ApiResponse({ status: 200, description: '재발급 성공' })
  @ApiResponse({
    status: 401,
    description: 'Refresh Token이 유효하지 않거나 만료됨',
  })
  @Refresh()
  @Post('refresh-access')
  @HttpCode(HttpStatus.OK)
  async refreshAccessToken(
    @Req() req: RequestWithToken,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { id, role } = req.user;
    await this.authService.issueAccessToken({ id, role }, res);
  }
}
