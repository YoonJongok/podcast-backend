import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { number } from 'joi';
import { async } from 'rxjs';
import { Repository } from 'typeorm';
import { JwtService } from '../jwt/jwt.service';
import { User, UserRole } from './entities/user.entities';
import { UsersService } from './users.service';

const mockUserRepository = () => ({
  create: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
});
const TEST_TOKEN = 'signed-token-baby';
const mockJwtService = {
  sign: jest.fn(() => TEST_TOKEN),
  verify: jest.fn(),
};
const hostArgs = {
  email: 'host@test.com',
  password: 'password_host',
  username: 'host',
  role: UserRole.Any,
};
const TEST_HOST = {
  id: 1,
  ...hostArgs,
};
type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UsersServiceTest', () => {
  let service: UsersService;
  let userRepository: MockRepository<User>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository(),
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();
    service = module.get<UsersService>(UsersService);
    userRepository = module.get(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userRepository).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  describe('createUser', () => {
    it('should create user account', async () => {
      userRepository.findOne.mockResolvedValueOnce(null);
      userRepository.create.mockReturnValueOnce(hostArgs);
      userRepository.save.mockResolvedValueOnce(TEST_HOST);
      const result = await service.createUser(hostArgs);
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.findOne).toHaveBeenCalledWith(hostArgs.email);
      expect(userRepository.save).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledWith(hostArgs);
      expect(result).toMatchObject({ ok: true, id: TEST_HOST.id });
    });
    it('should fail if user exists', async () => {
      userRepository.findOne.mockResolvedValueOnce(TEST_HOST);
      const result = await service.createUser(hostArgs);

      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.findOne).toHaveBeenCalledWith(TEST_HOST.email);
      expect(userRepository.create).toHaveBeenCalledTimes(0);
      expect(userRepository.save).toHaveBeenCalledTimes(0);

      expect(result).toMatchObject({ ok: false, error: 'Email already exist' });
    });
    it('should fail because of save fail', async () => {
      userRepository.findOne.mockResolvedValueOnce(null);
      userRepository.create.mockReturnValueOnce(hostArgs);
      userRepository.save.mockRejectedValueOnce(
        new Error('Mocked Error on createAccount'),
      );
      const result = await service.createUser(hostArgs);
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.findOne).toHaveBeenCalledWith(hostArgs.email);
      expect(userRepository.create).toHaveBeenCalledTimes(1);
      expect(userRepository.create).toHaveBeenCalledWith(hostArgs);
      expect(userRepository.save).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledWith(hostArgs);
      expect(result).toMatchObject({
        ok: false,
        error: 'Internal server Error occured',
      });
    });
  });

  describe('login', () => {
    it('should return token if user is successfully logged in', async () => {
      const correctPasswordUser = {
        ...TEST_HOST,
        comparePassword: jest.fn(() => Promise.resolve(true)),
      };
      userRepository.findOne.mockResolvedValueOnce(correctPasswordUser);
      const result = await service.login({ ...hostArgs });
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(jwtService.sign).toHaveBeenCalledTimes(1);
      expect(jwtService.sign).toHaveBeenCalledWith(expect.any(Number));
      expect(result).toMatchObject({
        ok: true,
        token: TEST_TOKEN,
      });
    });
    it('should fail if user does not exist', async () => {
      userRepository.findOne.mockResolvedValue(null);
      const result = await service.login(hostArgs);
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        email: hostArgs.email,
      });
      expect(result).toEqual({
        ok: false,
        error: 'User not found.',
      });
    });
    it('should fail if the password is wrong', async () => {
      const wrongPasswordUser = {
        ...TEST_HOST,
        checkPassword: jest.fn(() => Promise.resolve(false)),
      };
      userRepository.findOne.mockResolvedValue(wrongPasswordUser);
      const result = await service.login(wrongPasswordUser);

      expect(result).toEqual({
        ok: false,
        error: 'Internal server Error occured',
      });
    });
    it('should fail on exception', async () => {
      userRepository.findOne.mockRejectedValue(new Error());
      const result = await service.login(hostArgs);
      expect(result).toEqual({
        ok: false,
        error: 'Internal server Error occured',
      });
    });
  });
  describe('findUserById', () => {
    const findByIdArgs = {
      id: 1,
    };
    it('should find an existing user', async () => {
      userRepository.findOne.mockResolvedValue(findByIdArgs);
      const result = await service.findUserById(1);
      expect(result).toEqual({ ok: true, user: findByIdArgs });
    });

    it('should fail if no user is found', async () => {
      userRepository.findOne.mockRejectedValue(new Error());
      const result = await service.findUserById(1);
      expect(result).toEqual({
        ok: false,
        error: 'Internal server Error occured',
      });
    });
  });
  it.todo('editProfile');
});
