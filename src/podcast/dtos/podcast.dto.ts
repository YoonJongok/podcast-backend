import { Podcast } from './../entities/podcast.entities';
import { Field, ObjectType, InputType, PickType } from '@nestjs/graphql';
import { CoreOutput } from './output.dto';
import { IsNumber, IsOptional } from 'class-validator';

@InputType()
export class PodcastSearchInput extends PickType(Podcast, ['id'], InputType) {
  @Field(() => Number)
  @IsNumber()
  id: number;
}

@ObjectType()
export class GetAllPodcastsOutput extends CoreOutput {
  @IsOptional()
  @Field(() => [Podcast], { nullable: true })
  podcasts?: Podcast[];
}

@ObjectType()
export class PodcastOutput extends CoreOutput {
  @Field(() => Podcast, { nullable: true })
  podcast?: Podcast;
}
