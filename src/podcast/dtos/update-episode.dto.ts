import { ArgsType } from '@nestjs/graphql';

@ArgsType()
export class UpdateEpisodeDto {
  title?: string;
  category?: string;
  rating?: number;
}
