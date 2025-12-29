import { Test, TestingModule } from '@nestjs/testing';
import { VerificationTokenController } from './verification-token.controller';
import { VerificationTokenService } from './verification-token.service';

describe('VerificationTokenController', () => {
  let controller: VerificationTokenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VerificationTokenController],
      providers: [VerificationTokenService],
    }).compile();

    controller = module.get<VerificationTokenController>(
      VerificationTokenController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
