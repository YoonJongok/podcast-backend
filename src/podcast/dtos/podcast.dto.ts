import { Podcast } from './../entities/podcast.entities';
import { Field, ObjectType, PickType, InputType, Int } from '@nestjs/graphql';
import { CoreOutput } from './output.dto';
import { IsInt, IsNumber, IsOptional } from 'class-validator';
import { Episode } from '../entities/episode.entities';

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

@InputType()
export class EpisodeSearchInput {
  @Field(() => Int)
  @IsInt()
  podcastId: number;

  @Field(() => Int)
  @IsInt()
  episodeId: number;
}

@ObjectType()
export class GetAllEpisodesOuput extends CoreOutput {
  @Field((type) => [Episode], { nullable: true })
  episodes?: Episode[];
}

@ObjectType()
export class GetEpisodeOutput extends CoreOutput {
  @Field((type) => Episode, { nullable: true })
  episode?: Episode;
}
