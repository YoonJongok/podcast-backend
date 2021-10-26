import { ArgsType } from '@nestjs/graphql';
import { Episode } from './../entities/episode.entities';
@ArgsType()
export class UpdatePodcastDto {
  readonly title?: string;
  readonly category?: string;
  readonly rating?: number;
  readonly episodes?: Episode[];
}
