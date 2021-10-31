import { CoreOutput } from './output.dto';
import { Field, InputType, Int, PickType, ObjectType } from '@nestjs/graphql';
import { IsInt } from 'class-validator';
import { Episode } from '../entities/episode.entities';

@InputType()
export class CreateEpisodeInput extends PickType(
  Episode,
  ['title', 'category'],
  InputType,
) {
  @Field((type) => Int)
  @IsInt()
  podcastId: number;
}

@ObjectType()
export class CreateEpisodeOutput extends CoreOutput {
  @Field((type) => Int, { nullable: true })
  @IsInt()
  id?: number;
}
