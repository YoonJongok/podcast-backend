import { ArgsType } from '@nestjs/graphql';

@ArgsType()
export class CreatePodcastDto {
  readonly title: string;
  readonly category: string;
}
