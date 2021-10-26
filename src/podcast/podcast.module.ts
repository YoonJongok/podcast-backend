import { Module } from '@nestjs/common';
import { PodcastService } from './podcast.service';
import { PodcastController } from './podcast.controller';
import { PodcastResolver } from './podcast.resolver';

@Module({
  providers: [PodcastService, PodcastResolver],
  controllers: [PodcastController],
})
export class PodcastModule {}
