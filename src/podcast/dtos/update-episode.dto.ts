import { InputType } from '@nestjs/graphql';

@InputType()
export class UpdateEpisodeDto {
  title?: string;
  category?: string;
  rating?: number;
}
