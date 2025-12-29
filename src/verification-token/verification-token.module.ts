import { Module } from '@nestjs/common';
import { VerificationTokenService } from './verification-token.service';
import { VerificationTokenController } from './verification-token.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerificationToken } from './entities/verification-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VerificationToken])],
  controllers: [VerificationTokenController],
  providers: [VerificationTokenService],
})
export class VerificationTokenModule {}
