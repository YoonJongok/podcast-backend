import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { object } from 'joi';
import { Repository } from 'typeorm';
import { JwtService } from '../jwt/jwt.service';
import { CreateUserInput, CreateUserOutput } from './dtos/create-user.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { UserProfileInput, UserProfileOutput } from './dtos/see-profile.dto';
import { User } from './entities/user.entities';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
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
    username,
    password,
    role,
  }: CreateUserInput): Promise<CreateUserOutput> {
    try {
      const exist = await this.usersRepository.findOne({ where: { email } });
      if (exist) {
        return this.ExistInDatabaseError('Email');
      }
      const newUser = this.usersRepository.create({
        email,
        username,
        password,
        role,
      });

      const { id } = await this.usersRepository.save(newUser);

      return {
        ok: true,
        id,
      };
    } catch (error) {
      console.log(error);
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
      const token = this.jwtService.sign(user.id);

      return {
        ok: true,
        token,
      };
    } catch (error) {
      return this.InternalServerError;
    }
  }

  async findUserById(userId: number): Promise<UserProfileOutput> {
    try {
      const user = await this.usersRepository.findOne(userId);
      if (!user) {
        return {
          ok: false,
          error: 'User not found.',
        };
      }
      return {
        ok: true,
        user,
      };
    } catch (error) {
      return this.InternalServerError;
    }
  }

  async editProfile(
    userId: number,
    { email, username, password }: EditProfileInput,
  ): Promise<EditProfileOutput> {
    try {
      const { ok, error, user } = await this.findUserById(userId);
      if (!ok) {
        return {
          ok,
          error,
        };
      }
      if (email) user.email = email;
      if (username) user.username = username;
      if (password) user.password = password;

      await this.usersRepository.save(user);
      return {
        ok: true,
      };
    } catch (error) {
      return this.InternalServerError;
    }
  }
}
