import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PodcastModule } from './podcast/podcast.module';

@Module({
  imports: [GraphQLModule.forRoot({ autoSchemaFile: true }), PodcastModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
