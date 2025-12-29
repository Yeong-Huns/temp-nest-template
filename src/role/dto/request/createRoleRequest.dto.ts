import { UserRole } from '../../enum/user-role';
import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleRequestDto {
  @ApiProperty({ description: 'role', example: 'ADMIN' })
  @IsEnum(UserRole)
  name: UserRole;
}
