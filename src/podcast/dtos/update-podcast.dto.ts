import { Episode } from './../entities/episode.entities';

export class UpdatePodcastDto {
  readonly title?: string;
  readonly category?: string;
  readonly rating?: number;
  readonly episodes?: Episode[];
}
