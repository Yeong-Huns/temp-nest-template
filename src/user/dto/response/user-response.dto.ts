import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../entities/user.entity';
import { Role } from '../../../role/entities/role.entity';

export class UserResponseDto {
  @ApiProperty({ description: '사용자 ID' })
  id: string;

  @ApiProperty({ description: '이메일' })
  email: string | null;

  @ApiProperty({ description: '이름' })
  name: string | null;

  @ApiProperty({ description: '프로필 이미지 URL' })
  image: string | null;

  @ApiProperty({ description: '권한 정보' })
  role: string;

  static from(user: User & { role: Role }) {
    const userResponseDto = new UserResponseDto();
    userResponseDto.id = user.id;
    userResponseDto.name = user.name;
    userResponseDto.image = user.image;
    userResponseDto.email = user.email;
    userResponseDto.role = user.role.name;
    return userResponseDto;
  }
}
