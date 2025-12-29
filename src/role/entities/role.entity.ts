import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../enum/user-role';

@Entity()
export class Role {
  @ApiProperty({
    description: '권한 ID (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: '권한 이름',
    enum: UserRole,
    example: UserRole.USER,
  })
  @Column({ type: 'varchar', unique: true })
  name: UserRole;
}
