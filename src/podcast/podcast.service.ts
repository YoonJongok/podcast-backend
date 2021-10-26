import { UpdatePodcastDto } from './dtos/update-podcast.dto';
import { Injectable } from '@nestjs/common';
import { CreatePodcastDto } from './dtos/create-podcast.dto';
import { Podcast } from './entities/podcast.entities';

@Injectable()
export class PodcastService {
  private podcasts: Podcast[];

  getAllPodcasts(): { podcasts: Podcast[]; error: string | null } {
    return { podcasts: this.podcasts, error: null };
  }

  createPodcast({ title, category }: CreatePodcastDto): {
    id: number;
    error: string | null;
  } {
    const id = Date.now();
    this.podcasts.push({ id, title, category, rating: 0, episodes: [] });
    return { id, error: null };
  }

  getPodcast(id: string): { podcast: Podcast | null; error: string | null } {
    const podcast = this.podcasts.filter((pod) => pod.id === +id);
    if (podcast.length === 0) {
      return { podcast: null, error: 'Podcast not found' };
    }
    if (podcast.length === 1) {
      return { podcast: podcast[0], error: null };
    }
    if (podcast.length > 1) {
      return {
        podcast: null,
        error: 'There is more than one podcasts with same id',
      };
    }
  }
  deletePodcast(id: string): { error: string | null } {
    this.podcasts = this.podcasts.filter((pod) => pod.id !== +id);
    return { error: null };
  }

  updatePodcast(
    id: string,
    updatePodcastDto: UpdatePodcastDto,
  ): { error: string | null } {
    const { podcast, error: findError } = this.getPodcast(id);
    if (findError) {
      return { error: findError };
    }
    const { error: deleteError } = this.deletePodcast(id);
    if (deleteError) {
      return { error: deleteError };
    }
    this.podcasts.push({ ...podcast, ...updatePodcastDto });
    return { error: null };
  }
}
