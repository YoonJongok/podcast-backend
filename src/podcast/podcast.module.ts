import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PodcastService } from './podcast.service';

import { EpisodeResolver, PodcastResolver } from './podcast.resolver';
import { Podcast } from './entities/podcast.entities';
import { Episode } from './entities/episode.entities';

@Module({
  imports: [TypeOrmModule.forFeature([Podcast, Episode])],
  providers: [PodcastService, PodcastResolver, EpisodeResolver],
})
export class PodcastModule {}
