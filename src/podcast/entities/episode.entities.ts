import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Episode {
  @Field((type) => Int)
  id: number;

  @Field((type) => String)
  title: string;

  @Field(() => String)
  category: string;

  @Field(() => Int)
  rating: number;
}
