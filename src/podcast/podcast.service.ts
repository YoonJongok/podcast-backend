import { UpdatePodcastDto } from './dtos/update-podcast.dto';
import { Injectable } from '@nestjs/common';
import { CreatePodcastDto } from './dtos/create-podcast.dto';
import { Podcast } from './entities/podcast.entities';
import { CoreOutput } from './dtos/output.dto';
import { PodcastOutput } from './dtos/podcast.dto';

@Injectable()
export class PodcastService {
  private podcasts: Podcast[] = [];

  getAllPodcasts(): Podcast[] {
    return this.podcasts;
  }

  createPodcast({ title, category }: CreatePodcastDto): CoreOutput {
    const id = Date.now();
    this.podcasts.push({ id, title, category, rating: 0, episodes: [] });
    return {
      ok: true,
    };
  }

  getPodcast(id: number): PodcastOutput {
    const podcast = this.podcasts.filter((pod) => pod.id === +id);
    if (podcast.length === 0) {
      return { ok: false, error: 'Podcast not found' };
    }
    if (podcast.length === 1) {
      return { ok: true, podcast: podcast[0] };
    }
    if (podcast.length > 1) {
      return {
        ok: false,
        error: 'There is more than one podcasts with same id',
      };
    }
  }
  deletePodcast(id: number): CoreOutput {
    const { ok, error } = this.getPodcast(id);
    if (!ok) {
      return {
        ok: false,
        error,
      };
    }
    this.podcasts = this.podcasts.filter((pod) => pod.id !== +id);
    return { ok: true };
  }

  updatePodcast(updatePodcastDto: UpdatePodcastDto): PodcastOutput {
    const { ok, error, podcast } = this.getPodcast(updatePodcastDto.id);
    if (!ok) {
      return { ok: false, error };
    }
    this.podcasts = this.podcasts.filter(
      (pod) => pod.id !== updatePodcastDto.id,
    );
    this.podcasts.push({ ...podcast, ...updatePodcastDto });
    return { ok: true };
  }
}
