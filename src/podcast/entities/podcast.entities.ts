import { Column, Entity, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { Episode } from './episode.entities';
import { CoreEntity } from '../../common/entities/core.entities';
import { IsNumber, IsString, Max, Min } from 'class-validator';
import { User } from '../../users/entities/user.entities';

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

  @ManyToOne(() => User, (user) => user.podcasts, {
    onDelete: 'CASCADE',
  })
  @Field((type) => User)
  owner: User;

  @RelationId((podcast: Podcast) => podcast.owner)
  ownerId: number;
}
