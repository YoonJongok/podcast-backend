import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

import { EpisodeSearchInput } from './podcast.dto';

@InputType()
export class UpdateEpisodeInput extends EpisodeSearchInput {
  @Field((type) => String, { nullable: true })
  @IsString()
  @IsOptional()
  readonly title?: string;

  @Field((type) => String, { nullable: true })
  @IsString()
  @IsOptional()
  readonly category?: string;
}
