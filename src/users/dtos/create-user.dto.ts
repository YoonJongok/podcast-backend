import { InputType, ObjectType, PickType, Field, Int } from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';
import { User } from '../entities/user.entities';

@InputType()
export class CreateUserInput extends PickType(User, [
  'email',
  'username',
  'password',
  'role',
]) {}

@ObjectType()
export class CreateUserOutput extends CoreOutput {
  @Field((type) => Int, { nullable: true })
  id?: number;
}
