import { UpdatePodcastDto } from './dtos/update-podcast.dto';
import { Injectable } from '@nestjs/common';
import {
  CreatePodcastInput,
  CreatePodcastOutput,
} from './dtos/create-podcast.dto';
import { Podcast } from './entities/podcast.entities';
import { CoreOutput } from './dtos/output.dto';
import { GetAllPodcastsOutput, PodcastOutput } from './dtos/podcast.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Episode } from './entities/episode.entities';

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
      const podcast = await this.podcastRepository.findOne(id);
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
  // deletePodcast(id: number): CoreOutput {
  //   const { ok, error } = this.getPodcast(id);
  //   if (!ok) {
  //     return {
  //       ok: false,
  //       error,
  //     };
  //   }
  //   this.podcasts = this.podcasts.filter((pod) => pod.id !== +id);
  //   return { ok: true };
  // }

  // updatePodcast(updatePodcastDto: UpdatePodcastDto): PodcastOutput {
  //   const { ok, error, podcast } = this.getPodcast(updatePodcastDto.id);
  //   if (!ok) {
  //     return { ok: false, error };
  //   }
  //   this.podcasts = this.podcasts.filter(
  //     (pod) => pod.id !== updatePodcastDto.id,
  //   );
  //   this.podcasts.push({ ...podcast, ...updatePodcastDto });
  //   return { ok: true };
  // }
}
