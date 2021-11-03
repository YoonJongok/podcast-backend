import { InputType, ObjectType, PartialType, PickType } from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';
import { User } from '../entities/user.entities';

@InputType()
export class EditProfileInput extends PartialType(
  PickType(User, ['username', 'password']),
) {}

@ObjectType()
export class EditProfileOutput extends CoreOutput {}
