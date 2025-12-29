import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../role/enum/user-role';
import { Role } from '../role/entities/role.entity';
import { Response } from 'express';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let configService: jest.Mocked<ConfigService>;
  let jwtService: jest.Mocked<JwtService>;
  let userRepository: any;

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  const mockUserRepository = {
    manager: {
      transaction: jest.fn(),
    },
    createQueryBuilder: jest.fn(),
  };

  const mockEntityManager = {
    getRepository: jest.fn(),
  };

  const mockUserRepoInTransaction = {
    existsBy: jest.fn(),
    save: jest.fn(),
  };

  const mockRoleRepoInTransaction = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    configService = module.get(ConfigService);
    jwtService = module.get(JwtService);
    userRepository = module.get(getRepositoryToken(User));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    const signUpDto = {
      email: 'test@example.com',
      name: '홍길동',
      password: 'password123',
    };

    it('should successfully sign up a new user', async () => {
      mockUserRepository.manager.transaction.mockImplementation((level, cb) =>
        cb(mockEntityManager),
      );
      mockEntityManager.getRepository.mockImplementation((entity) => {
        if (entity === User) return mockUserRepoInTransaction;
        if (entity === Role) return mockRoleRepoInTransaction;
      });

      mockUserRepoInTransaction.existsBy.mockResolvedValue(false);
      mockRoleRepoInTransaction.findOne.mockResolvedValue({
        id: 1,
        name: UserRole.USER,
      });
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      configService.get.mockReturnValue(10);
      mockUserRepoInTransaction.save.mockResolvedValue({
        id: 1,
        ...signUpDto,
        hashedPassword: 'hashedPassword',
        role: { name: UserRole.USER },
      });

      const result = await service.signUp(signUpDto);

      expect(result).toBeDefined();
      expect(result.email).toBe(signUpDto.email);
      expect(mockUserRepoInTransaction.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException if user already exists', async () => {
      mockUserRepository.manager.transaction.mockImplementation((level, cb) =>
        cb(mockEntityManager),
      );
      mockEntityManager.getRepository.mockReturnValue(
        mockUserRepoInTransaction,
      );
      mockUserRepoInTransaction.existsBy.mockResolvedValue(true);

      await expect(service.signUp(signUpDto)).rejects.toThrow(
        new BadRequestException('해당 이메일로 가입된 계정이 존재합니다.'),
      );
    });

    it('should throw BadRequestException if default role is missing', async () => {
      mockUserRepository.manager.transaction.mockImplementation((level, cb) =>
        cb(mockEntityManager),
      );
      mockEntityManager.getRepository.mockImplementation((entity) => {
        if (entity === User) return mockUserRepoInTransaction;
        if (entity === Role) return mockRoleRepoInTransaction;
      });

      mockUserRepoInTransaction.existsBy.mockResolvedValue(false);
      mockRoleRepoInTransaction.findOne.mockResolvedValue(null);

      await expect(service.signUp(signUpDto)).rejects.toThrow(
        new BadRequestException('기본 권한 설정이 잘못되었습니다.'),
      );
    });
  });

  describe('signIn', () => {
    const signInDto = { email: 'test@example.com', password: 'password123' };
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      hashedPassword: 'hashedPassword',
      role: { name: UserRole.USER },
    };
    const mockRes = {
      cookie: jest.fn(),
    } as unknown as Response;

    it('should successfully sign in', async () => {
      const queryBuilder = {
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockUser),
      };
      userRepository.createQueryBuilder.mockReturnValue(queryBuilder);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.signAsync.mockResolvedValue('token');
      configService.get.mockReturnValue('secret');

      await service.signIn(signInDto, mockRes);

      expect(mockRes.cookie).toHaveBeenCalledTimes(2);
      expect(jwtService.signAsync).toHaveBeenCalledTimes(2);
    });

    it('should throw BadRequestException if user not found', async () => {
      const queryBuilder = {
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };
      userRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      await expect(service.signIn(signInDto, mockRes)).rejects.toThrow(
        new BadRequestException('아이디 혹은 비밀번호가 잘못되었습니다.'),
      );
    });

    it('should throw BadRequestException if password incorrect', async () => {
      const queryBuilder = {
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockUser),
      };
      userRepository.createQueryBuilder.mockReturnValue(queryBuilder);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.signIn(signInDto, mockRes)).rejects.toThrow(
        new BadRequestException('아이디 혹은 비밀번호가 잘못되었습니다.'),
      );
    });
  });

  describe('signOut', () => {
    it('should clear cookies', () => {
      const mockRes = {
        clearCookie: jest.fn(),
      } as unknown as Response;

      service.signOut(mockRes);

      expect(mockRes.clearCookie).toHaveBeenCalledTimes(2);
      expect(mockRes.clearCookie).toHaveBeenCalledWith(
        'accessToken',
        expect.any(Object),
      );
      expect(mockRes.clearCookie).toHaveBeenCalledWith(
        'refreshToken',
        expect.any(Object),
      );
    });
  });

  describe('issueAccessToken', () => {
    it('should issue an access token', async () => {
      const mockUser = { id: 1, role: { name: UserRole.USER } } as any;
      const mockRes = {
        cookie: jest.fn(),
      } as unknown as Response;

      jwtService.signAsync.mockResolvedValue('access_token');
      configService.get.mockReturnValue('secret');

      await service.issueAccessToken(mockUser, mockRes);

      expect(jwtService.signAsync).toHaveBeenCalled();
      expect(mockRes.cookie).toHaveBeenCalledWith(
        'accessToken',
        'access_token',
        expect.any(Object),
      );
    });
  });
});
