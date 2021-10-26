import { ArgsType } from '@nestjs/graphql';
import { CreatePodcastDto } from './create-podcast.dto';

@ArgsType()
export class CreateEpisodeDto extends CreatePodcastDto {}
