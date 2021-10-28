import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreatePodcastDto } from './dtos/create-podcast.dto';
import { CoreOutput } from './dtos/output.dto';
import { PodcastOutput, PodcastSearchInput } from './dtos/podcast.dto';
import { UpdatePodcastDto } from './dtos/update-podcast.dto';
import { Podcast } from './entities/podcast.entities';
import { PodcastService } from './podcast.service';

@Resolver((of) => Podcast)
export class PodcastResolver {
  constructor(private readonly podcastService: PodcastService) {}

  @Query((returns) => [Podcast])
  getAllPodcasts() {
    return this.podcastService.getAllPodcasts();
  }

  @Mutation((returns) => CoreOutput)
  createPodcast(@Args('input') createPodcastDto: CreatePodcastDto): CoreOutput {
    return this.podcastService.createPodcast(createPodcastDto);
  }

  @Query((returns) => PodcastOutput)
  getPodcast(@Args('input') podcastSearchInput: PodcastSearchInput) {
    return this.podcastService.getPodcast(podcastSearchInput.id);
  }
  @Mutation((returns) => CoreOutput)
  deletePodcast(@Args('input') podcastSearchInput: PodcastSearchInput) {
    return this.podcastService.deletePodcast(podcastSearchInput.id);
  }

  @Mutation((returns) => PodcastOutput)
  updatePodcast(@Args('input') updatePodcastDto: UpdatePodcastDto) {
    return this.podcastService.updatePodcast(updatePodcastDto);
  }
  // getAllEpisodes()
  // createEpisode()
  // updateEpisodes()
  // deleteEpisode()
}
