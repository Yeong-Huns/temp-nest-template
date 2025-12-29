import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'verification_token' })
export class VerificationToken {
  @ApiProperty({
    description: '인증 식별자 (예: 이메일)',
    example: 'user@example.com',
  })
  @PrimaryColumn({ type: 'varchar' })
  identifier: string;

  @ApiProperty({
    description: '인증 토큰',
    example: 'a7c8b9d0-e1f2-3g4h-5i6j-7k8l9m0n1o2p',
  })
  @PrimaryColumn({ type: 'varchar' })
  token: string;

  @ApiProperty({
    description: '토큰 만료 시간',
    example: '2025-12-30T10:00:00Z',
  })
  @Column({ type: 'datetime' })
  expires: Date;
}
