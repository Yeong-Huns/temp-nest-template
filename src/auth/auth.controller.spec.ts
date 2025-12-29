import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/request/sign-up.dto';
import { SignInDto } from './dto/request/sign-in.dto';
import { Response } from 'express';
import { UserResponseDto } from '../user/dto/response/user-response.dto';
import { UserRole } from '../role/enum/user-role';

describe('AuthController', () => {
  let controller: AuthController;
  let service: jest.Mocked<AuthService>;

  const mockAuthService = {
    signUp: jest.fn(),
    signIn: jest.fn(),
    signOut: jest.fn(),
    issueAccessToken: jest.fn(),
  };

  const mockResponse = {
    cookie: jest.fn(),
    clearCookie: jest.fn(),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signUp', () => {
    it('should call authService.signUp and return the result', async () => {
      const signUpDto: SignUpDto = {
        email: 'test@test.com',
        name: 'test',
        password: 'password',
      };
      const expectedResult = {
        id: 1,
        name: 'test',
        email: 'test@test.com',
      } as unknown as UserResponseDto;
      service.signUp.mockResolvedValue(expectedResult);

      const result = await controller.signUp(signUpDto);

      expect(service.signUp).toHaveBeenCalledWith(signUpDto);
      expect(result).toBe(expectedResult);
    });
  });

  describe('signIn', () => {
    it('should call authService.signIn', async () => {
      const signInDto: SignInDto = {
        email: 'test@test.com',
        password: 'password',
      };

      await controller.signIn(signInDto, mockResponse);

      expect(service.signIn).toHaveBeenCalledWith(signInDto, mockResponse);
    });
  });

  describe('signOut', () => {
    it('should call authService.signOut', () => {
      controller.signOut(mockResponse);

      expect(service.signOut).toHaveBeenCalledWith(mockResponse);
    });
  });

  describe('refreshAccessToken', () => {
    it('should call authService.issueAccessToken with user info from request', async () => {
      const mockReq = {
        user: { id: 1, role: { name: UserRole.USER } },
      } as any;

      await controller.refreshAccessToken(mockReq, mockResponse);

      expect(service.issueAccessToken).toHaveBeenCalledWith(
        { id: mockReq.user.id, role: mockReq.user.role },
        mockResponse,
      );
    });
  });
});
