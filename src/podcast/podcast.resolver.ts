import {
  CreateEpisodeInput,
  CreateEpisodeOutput,
} from './dtos/create-episode.dto';
import { UpdatePodcastInput } from './dtos/update-podcast.dto';
import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
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
import { AuthUser } from '../auth/auth-user.decorator';
import { User } from '../users/entities/user.entities';
import { Role } from '../auth/role.decorator';

@Resolver((of) => Podcast)
export class PodcastResolver {
  constructor(private readonly podcastService: PodcastService) {}

  @ResolveField((type) => Int)
  episodeCount(@Parent() podcast: Podcast): Promise<number> {
    return this.podcastService.countEpisodes(podcast);
  }

  @Query((returns) => GetAllPodcastsOutput)
  getAllPodcasts(): Promise<GetAllPodcastsOutput> {
    return this.podcastService.getAllPodcasts();
  }

  @Role(['Any'])
  @Mutation((returns) => CreatePodcastOutput)
  createPodcast(
    @AuthUser() owner: User,
    @Args('input') createPodcastInput: CreatePodcastInput,
  ): Promise<CreatePodcastOutput> {
    return this.podcastService.createPodcast(owner, createPodcastInput);
  }

  @Query((returns) => PodcastOutput)
  getPodcast(
    @Args('input') podcastSearchInput: PodcastSearchInput,
  ): Promise<PodcastOutput> {
    return this.podcastService.getPodcast(podcastSearchInput.id);
  }

  @Role(['Host'])
  @Mutation((returns) => CoreOutput)
  deletePodcast(
    @AuthUser() owner: User,
    @Args('input') podcastSearchInput: PodcastSearchInput,
  ) {
    return this.podcastService.deletePodcast(owner, podcastSearchInput.id);
  }

  @Role(['Host'])
  @Mutation((returns) => PodcastOutput)
  updatePodcast(
    @AuthUser() owner: User,
    @Args('input') updatePodcastInput: UpdatePodcastInput,
  ) {
    return this.podcastService.updatePodcast(owner, updatePodcastInput);
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

  @Role(['Host'])
  @Mutation((returns) => CreateEpisodeOutput)
  createEpisode(
    @AuthUser() owner: User,
    @Args('intput') createEpisodeInput: CreateEpisodeInput,
  ): Promise<CreateEpisodeOutput> {
    return this.podcastService.createEpisode(owner, createEpisodeInput);
  }

  @Role(['Host'])
  @Mutation((returns) => CoreOutput)
  updateEpisode(
    @AuthUser() owner: User,

    @Args('input') updateEpisodeInput: UpdateEpisodeInput,
  ): Promise<CoreOutput> {
    return this.podcastService.updateEpisode(owner, updateEpisodeInput);
  }

  @Role(['Host'])
  @Mutation((returns) => CoreOutput)
  deleteEpisode(
    @AuthUser() owner: User,

    @Args('input') episodeSearchInput: EpisodeSearchInput,
  ): Promise<CoreOutput> {
    return this.podcastService.deleteEpisode(owner, episodeSearchInput);
  }
}
