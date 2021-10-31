import { InputType, PartialType, PickType, Field } from '@nestjs/graphql';
import { Podcast } from '../entities/podcast.entities';

@InputType()
export class UpdatePodcastPayload extends PartialType(
  PickType(Podcast, ['title', 'rating', 'category']),
  InputType,
) {}

@InputType()
export class UpdatePodcastInput extends PickType(Podcast, ['id'], InputType) {
  @Field((type) => UpdatePodcastPayload)
  payload: UpdatePodcastPayload;
}
