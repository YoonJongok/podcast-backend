import { Podcast } from './podcast.entities';
import { CoreEntity } from './core.entities';
import { Field, ObjectType, InputType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { IsString } from 'class-validator';

@Entity()
@ObjectType()
export class Episode extends CoreEntity {
  @Column()
  @Field((type) => String)
  @IsString()
  title: string;

  @Column()
  @Field((type) => String)
  @IsString()
  category: string;

  @ManyToOne(() => Podcast, (podcast) => podcast.episodes, {
    onDelete: 'CASCADE',
  })
  @Field((type) => Podcast)
  podcast: Podcast;
}
