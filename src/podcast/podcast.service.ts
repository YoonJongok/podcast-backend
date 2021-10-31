import { UpdatePodcastInput } from './dtos/update-podcast.dto';
import { Injectable } from '@nestjs/common';
import {
  CreatePodcastInput,
  CreatePodcastOutput,
} from './dtos/create-podcast.dto';
import { Podcast } from './entities/podcast.entities';
import { CoreOutput } from './dtos/output.dto';
import {
  EpisodeSearchInput,
  GetAllEpisodesOuput,
  GetAllPodcastsOutput,
  GetEpisodeOutput,
  PodcastOutput,
} from './dtos/podcast.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Episode } from './entities/episode.entities';
import {
  CreateEpisodeInput,
  CreateEpisodeOutput,
} from './dtos/create-episode.dto';
import { UpdateEpisodeInput } from './dtos/update-episode.dto';

@Injectable()
export class PodcastService {
  constructor(
    @InjectRepository(Podcast)
    private readonly podcastRepository: Repository<Podcast>,
    @InjectRepository(Episode)
    private readonly episodeRepository: Repository<Episode>,
  ) {}
  private readonly InternalServerErrorOutput = {
    ok: false,
    error: 'Internal server error occured',
  };

  async getAllPodcasts(): Promise<GetAllPodcastsOutput> {
    try {
      const podcasts = await this.podcastRepository.find();
      return {
        ok: true,
        podcasts,
      };
    } catch (error) {
      return this.InternalServerErrorOutput;
    }
  }

  async createPodcast({
    title,
    category,
  }: CreatePodcastInput): Promise<CreatePodcastOutput> {
    try {
      const newPodcast = this.podcastRepository.create({ title, category });
      const { id } = await this.podcastRepository.save(newPodcast);
      return {
        ok: true,
        id,
      };
    } catch (error) {
      return this.InternalServerErrorOutput;
    }
  }

  async getPodcast(id: number): Promise<PodcastOutput> {
    try {
      const podcast = await this.podcastRepository.findOne(
        { id },
        { relations: ['episodes'] },
      );
      if (!podcast) {
        return {
          ok: false,
          error: "Podcast doesn't exist with this id",
        };
      }
      return {
        ok: true,
        podcast,
      };
    } catch (error) {
      return this.InternalServerErrorOutput;
    }
  }
  async deletePodcast(id: number): Promise<CoreOutput> {
    try {
      const { ok, error } = await this.getPodcast(id);
      if (!ok) {
        return {
          ok,
          error,
        };
      }
      await this.podcastRepository.delete(id);
      return { ok: true };
    } catch (error) {
      return this.InternalServerErrorOutput;
    }
  }

  async updatePodcast({
    id,
    payload,
  }: UpdatePodcastInput): Promise<PodcastOutput> {
    try {
      const { ok, error, podcast } = await this.getPodcast(id);
      if (!ok) {
        return { ok, error };
      }
      if (payload.rating !== null) {
        if (payload.rating < 1 || payload.rating > 5) {
          return {
            ok: false,
            error: 'Rating must be between 1 and 5.',
          };
        }
      }
      const updatedPodcast: Podcast = { ...podcast, ...payload };
      await this.podcastRepository.save(updatedPodcast);
      return {
        ok: true,
      };
    } catch (error) {
      return this.InternalServerErrorOutput;
    }
  }

  async getAllEpisodes(id: number): Promise<GetAllEpisodesOuput> {
    try {
      const { ok, error, podcast } = await this.getPodcast(id);
      if (!ok) {
        return { ok, error };
      }

      return { ok: true, episodes: podcast.episodes };
    } catch (error) {
      console.log(error);
      return this.InternalServerErrorOutput;
    }
  }

  async getEpisode({
    podcastId,
    episodeId,
  }: EpisodeSearchInput): Promise<GetEpisodeOutput> {
    try {
      const { ok, error, episodes } = await this.getAllEpisodes(podcastId);
      if (!ok) {
        return { ok, error };
      }

      const episode = episodes.find((epi) => epi.id === episodeId);
      if (!episode) {
        return {
          ok: false,
          error: `Episode with id ${episodeId} not found in podcast with id ${podcastId}`,
        };
      }
      return {
        ok: true,
        episode,
      };
    } catch (error) {
      console.log(error);
      return this.InternalServerErrorOutput;
    }
  }

  async createEpisode({
    podcastId,
    title,
    category,
  }: CreateEpisodeInput): Promise<CreateEpisodeOutput> {
    try {
      const { ok, error, podcast } = await this.getPodcast(podcastId);
      if (!ok) {
        return { ok, error };
      }
      const newEpisode = this.episodeRepository.create({ title, category });
      newEpisode.podcast = podcast;
      const { id } = await this.episodeRepository.save(newEpisode);
      return {
        ok: true,
        id,
      };
    } catch (error) {
      console.log(error);
      return this.InternalServerErrorOutput;
    }
  }
  async updateEpisode({
    podcastId,
    episodeId,
    ...updatedValues
  }: UpdateEpisodeInput): Promise<CoreOutput> {
    try {
      const { ok, error, episode } = await this.getEpisode({
        podcastId,
        episodeId,
      });
      if (!ok) {
        return { ok, error };
      }
      const updatedEpisode = { ...episode, ...updatedValues };
      await this.episodeRepository.save(updatedEpisode);
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return this.InternalServerErrorOutput;
    }
  }

  async deleteEpisode({
    episodeId,
    podcastId,
  }: EpisodeSearchInput): Promise<CoreOutput> {
    try {
      const { ok, error, episode } = await this.getEpisode({
        podcastId,
        episodeId,
      });
      if (!ok) {
        return { ok, error };
      }
      await this.episodeRepository.delete({ id: episode.id });

      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return this.InternalServerErrorOutput;
    }
  }
}
