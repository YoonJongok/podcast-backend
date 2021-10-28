import { Podcast } from './../entities/podcast.entities';
import { Field, ObjectType, InputType } from '@nestjs/graphql';
import { CoreOutput } from './output.dto';
import { IsNumber } from 'class-validator';

@InputType()
export class PodcastSearchInput {
  @Field(() => Number)
  @IsNumber()
  id: number;
}

@ObjectType()
export class PodcastOutput extends CoreOutput {
  @Field(() => Podcast, { nullable: true })
  podcast?: Podcast;
}
