import { PodcastService } from './podcast.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreatePodcastDto } from './dtos/create-podcast.dto';

@Controller('/podcast')
export class PodcastController {
  constructor(private readonly podcastService: PodcastService) {}

  @Get()
  getAllPodcasts() {
    return this.podcastService.getAllPodcasts();
  }

  @Post()
  createPodcast(@Body() createPodcastDto: CreatePodcastDto) {
    return this.podcastService.createPodcast(createPodcastDto);
  }

  @Get('/:id')
  getPodcast(@Param('id') id: string) {
    return this.podcastService.getPodcast(id);
  }

  @Patch('/:id')
  updatePodcast(@Param('id') id: string, @Body() updatePodcastDto) {
    return this.podcastService.updatePodcast(id, updatePodcastDto);
  }

  @Delete('/:id')
  deletePodcast(@Param('id') id: string) {
    return this.podcastService.deletePodcast(id);
  }
}
@Controller('/podcasts/:id')
export class EpisodeController {
  constructor(private readonly podcastService: PodcastService) {}

  @Get('/episodes')
  getAllEpisodes() {}

  @Post('/episodes')
  createEpisode(@Body() createEpisodeDto) {}

  @Patch('/episodes/:episodeId')
  updateEpisodes(
    @Param('id') podcastId: string,
    @Param('episodeId') episodeId: string,
    @Body() updateEpisodeDto,
  ) {}

  @Delete('/episodes/:episodeId')
  deleteEpisode(
    @Param('id') podcastId: string,
    @Param('episodeId') episodeId: string,
  ) {}
}
