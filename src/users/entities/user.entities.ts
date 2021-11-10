import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsEmail, IsString } from 'class-validator';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entities';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { Podcast } from '../../podcast/entities/podcast.entities';

export enum UserRole {
  Host = 'Host',
  Listener = 'Listener',
}

registerEnumType(UserRole, {
  name: 'UserRole',
});

@Entity()
@InputType('UserInputType', { isAbstract: true })
@ObjectType()
export class User extends CoreEntity {
  @Column({ unique: true })
  @Field((type) => String)
  @IsEmail()
  email: string;

  @Column()
  @Field((type) => String)
  @IsString()
  username: string;

  @Column()
  @Field((type) => String)
  @IsString()
  password: string;

  @Column({ type: 'simple-enum', enum: UserRole, default: UserRole.Host })
  @Field((type) => UserRole)
  role: UserRole;

  @OneToMany(() => Podcast, (podcasts) => podcasts.owner)
  @Field((type) => [Podcast], { nullable: true })
  podcasts?: Podcast[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error occured while hashing the password',
      );
    }
  }

  async comparePassword(receivedPassword: string) {
    try {
      const ok = bcrypt.compare(receivedPassword, this.password);
      return ok;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
