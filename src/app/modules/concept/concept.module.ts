import { Module } from '@nestjs/common';
import { ConceptService } from './concept.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Concept } from 'src/database/entity/concept.entity';
import { ConceptController } from './concept.controller';
import { FileConceptModule } from '../file_concept/file_concept.module';
import { UsersModule } from '../users/users.module';
import { HistoryConceptModule } from '../history_concept/history_concept.module';

@Module({
  imports: [TypeOrmModule.forFeature([Concept]),FileConceptModule,UsersModule,HistoryConceptModule],
  controllers: [ConceptController],
  providers: [ConceptService],
  exports: [ConceptService],
})
export class ConceptModule {}
