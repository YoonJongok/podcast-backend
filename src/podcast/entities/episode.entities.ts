import { Field, ObjectType, InputType } from '@nestjs/graphql';

@InputType('EpisodeInput', { isAbstract: true })
@ObjectType()
export class Episode {
  @Field(() => Number)
  id: number;

  @Field(() => String)
  title: string;

  @Field(() => String)
  category: string;

  @Field(() => Number)
  rating: number;
}
