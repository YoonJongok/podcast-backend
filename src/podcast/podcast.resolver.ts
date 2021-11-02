import {
  CreateEpisodeInput,
  CreateEpisodeOutput,
} from './dtos/create-episode.dto';
import { UpdatePodcastInput } from './dtos/update-podcast.dto';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CreatePodcastInput,
  CreatePodcastOutput,
} from './dtos/create-podcast.dto';
import { CoreOutput } from '../common/dtos/output.dto';
import {
  EpisodeSearchInput,
  GetAllEpisodesOuput,
  GetAllPodcastsOutput,
  GetEpisodeOutput,
  PodcastOutput,
  PodcastSearchInput,
} from './dtos/podcast.dto';

import { Podcast } from './entities/podcast.entities';
import { PodcastService } from './podcast.service';
import { Episode } from './entities/episode.entities';
import { UpdateEpisodeInput } from './dtos/update-episode.dto';

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

  @Mutation((returns) => CoreOutput)
  deletePodcast(@Args('input') podcastSearchInput: PodcastSearchInput) {
    return this.podcastService.deletePodcast(podcastSearchInput.id);
  }

  @Mutation((returns) => PodcastOutput)
  updatePodcast(@Args('input') updatePodcastInput: UpdatePodcastInput) {
    return this.podcastService.updatePodcast(updatePodcastInput);
  }
}

@Resolver((of) => Episode)
export class EpisodeResolver {
  constructor(private readonly podcastService: PodcastService) {}

  @Query((returns) => GetAllEpisodesOuput)
  getAllEpisodes(
    @Args('input') podcastSearchInput: PodcastSearchInput,
  ): Promise<GetAllEpisodesOuput> {
    return this.podcastService.getAllEpisodes(podcastSearchInput.id);
  }

  @Query((returns) => GetEpisodeOutput)
  getEpisode(
    @Args('input') episodeSearchInput: EpisodeSearchInput,
  ): Promise<GetEpisodeOutput> {
    return this.podcastService.getEpisode(episodeSearchInput);
  }

  @Mutation((returns) => CreateEpisodeOutput)
  createEpisode(
    @Args('intput') createEpisodeInput: CreateEpisodeInput,
  ): Promise<CreateEpisodeOutput> {
    return this.podcastService.createEpisode(createEpisodeInput);
  }

  @Mutation((returns) => CoreOutput)
  updateEpisode(
    @Args('input') updateEpisodeInput: UpdateEpisodeInput,
  ): Promise<CoreOutput> {
    return this.podcastService.updateEpisode(updateEpisodeInput);
  }

  @Mutation((returns) => CoreOutput)
  deleteEpisode(
    @Args('input') episodeSearchInput: EpisodeSearchInput,
  ): Promise<CoreOutput> {
    return this.podcastService.deleteEpisode(episodeSearchInput);
  }
}
