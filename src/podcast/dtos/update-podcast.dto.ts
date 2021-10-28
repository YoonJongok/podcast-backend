import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Episode } from './../entities/episode.entities';
import { PodcastSearchInput } from './podcast.dto';
@InputType({ isAbstract: true })
@ObjectType()
export class UpdatePodcastDto extends PodcastSearchInput {
  @Field((_) => String, { nullable: true })
  @IsString()
  @IsOptional()
  readonly title?: string;
  @Field((_) => String, { nullable: true })
  @IsString()
  @IsOptional()
  readonly category?: string;
  @Field((_) => Number, { nullable: true })
  @IsNumber()
  @IsOptional()
  readonly rating?: number;

  @Field((_) => [Episode], { nullable: true })
  @IsOptional()
  readonly episodes?: Episode[];
}
