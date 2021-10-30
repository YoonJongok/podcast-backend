import { Column, Entity, OneToMany } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { Episode } from './episode.entities';
import { CoreEntity } from './core.entities';
import { IsNumber, IsString, Max, Min } from 'class-validator';

@Entity()
@ObjectType()
export class Podcast extends CoreEntity {
  @Column()
  @Field((type) => String)
  @IsString()
  title: string;

  @Column()
  @Field((type) => String)
  @IsString()
  category: string;

  @Column({ default: 0 })
  @Field((type) => Number)
  @IsNumber()
  @Min(0)
  @Max(0)
  rating: number;

  @OneToMany(() => Episode, (episode) => episode.podcast)
  @Field((type) => [Episode])
  episodes: Episode[];
}
