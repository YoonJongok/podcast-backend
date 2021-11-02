import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { object } from 'joi';
import { Repository } from 'typeorm';
import { CreateUserInput, CreateUserOutput } from './dtos/create-user.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { User } from './entities/user.entities';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}
  private InternalServerError = {
    ok: false,
    error: 'Internal server Error occured',
  };

  private ExistInDatabaseError = (varName) => {
    return {
      ok: false,
      error: `${varName} already exist`,
    };
  };

  async createUser({
    email,
    password,
    role,
  }: CreateUserInput): Promise<CreateUserOutput> {
    try {
      const exist = await this.usersRepository.findOne({ where: { email } });
      if (exist) {
        return this.ExistInDatabaseError('Email');
      }
      const newUser = this.usersRepository.create({ email, password, role });
      const { id } = await this.usersRepository.save(newUser);

      return {
        ok: true,
        id,
      };
    } catch (error) {
      return this.InternalServerError;
    }
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.usersRepository.findOne({ email });
      if (!user) {
        return {
          ok: false,
          error: 'User not found.',
        };
      }

      const correctPassword = await user.comparePassword(password);
      if (!correctPassword) {
        return {
          ok: false,
          error: 'Wrong password',
        };
      }
      return {
        ok: true,
        // token
      };
    } catch (error) {
      return this.InternalServerError;
    }
  }
}
