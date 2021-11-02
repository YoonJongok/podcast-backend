import { Podcast } from './../entities/podcast.entities';
import { Field, InputType, ObjectType, PickType, Int } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreOutput } from '../../common/dtos/output.dto';

@InputType()
export class CreatePodcastInput extends PickType(
  Podcast,
  ['title', 'category'],
  InputType,
) {}

@ObjectType()
export class CreatePodcastOutput extends CoreOutput {
  @Field(() => Int, { nullable: true })
  id?: number;
}
