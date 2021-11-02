import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { CreateUserInput, CreateUserOutput } from './dtos/create-user.dto';
import { LoginOutput, LoginInput } from './dtos/login.dto';
import { User } from './entities/user.entities';
import { UsersService } from './users.service';

@Resolver((of) => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation((returns) => CreateUserOutput)
  createUser(
    @Args('input') createUserInput: CreateUserInput,
  ): Promise<CreateUserOutput> {
    return this.usersService.createUser(createUserInput);
  }

  @Mutation((returns) => LoginOutput)
  login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    return this.usersService.login(loginInput);
  }
}
