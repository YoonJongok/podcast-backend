import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CreatePodcastInput,
  CreatePodcastOutput,
} from './dtos/create-podcast.dto';
import { CoreOutput } from './dtos/output.dto';
import {
  GetAllPodcastsOutput,
  PodcastOutput,
  PodcastSearchInput,
} from './dtos/podcast.dto';
import { UpdatePodcastDto } from './dtos/update-podcast.dto';
import { Podcast } from './entities/podcast.entities';
import { PodcastService } from './podcast.service';

@Resolver((of) => Podcast)
export class PodcastResolver {
  constructor(private readonly podcastService: PodcastService) {}

  @Query((returns) => GetAllPodcastsOutput)
  getAllPodcasts(): Promise<GetAllPodcastsOutput> {
    return this.podcastService.getAllPodcasts();
  }

  @Mutation((returns) => CreatePodcastOutput)
  createPodcast(
    @Args('input') createPodcastDto: CreatePodcastInput,
  ): Promise<CreatePodcastOutput> {
    return this.podcastService.createPodcast(createPodcastDto);
  }

  @Query((returns) => PodcastOutput)
  getPodcast(
    @Args('input') podcastSearchInput: PodcastSearchInput,
  ): Promise<PodcastOutput> {
    return this.podcastService.getPodcast(podcastSearchInput.id);
  }

  // @Mutation((returns) => CoreOutput)
  // deletePodcast(@Args('input') podcastSearchInput: PodcastSearchInput) {
  //   return this.podcastService.deletePodcast(podcastSearchInput.id);
  // }

  // @Mutation((returns) => PodcastOutput)
  // updatePodcast(@Args('input') updatePodcastDto: UpdatePodcastDto) {
  //   return this.podcastService.updatePodcast(updatePodcastDto);
  // }
  // getAllEpisodes()
  // createEpisode()
  // updateEpisodes()
  // deleteEpisode()
}
