import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @ApiProperty({ description: '이메일', example: 'test@naver.com' })
  @IsEmail({}, { message: '이메일 형식이 올바르지 않습니다.' })
  email: string;

  @ApiProperty({ description: '비밀번호', example: 'qwer1234' })
  @IsString()
  @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
    message:
      '비밀번호는 영문 소문자, 대문자, 숫자, 특수문자를 각각 최소 1개 이상 포함해야 합니다.',
  })
  password: string;

  @ApiProperty({ description: '이름', example: '홍길동' })
  @IsString()
  name: string;

  @ApiProperty({
    description: '프로필 이미지 URL (선택 사항)',
    required: false,
    example: 'https://example.com/profile.jpg',
  })
  @IsOptional()
  @IsString()
  image?: string;
}
