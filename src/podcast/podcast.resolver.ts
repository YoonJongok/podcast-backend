import { Query, Resolver } from '@nestjs/graphql';
import { Podcast } from './entities/podcast.entities';
import { PodcastService } from './podcast.service';

@Resolver((of) => Podcast)
export class PodcastResolver {
  constructor(private readonly podcastService: PodcastService) {}

  @Query((returns) => Boolean)
  sayHi() {
    return true;
  }
}
