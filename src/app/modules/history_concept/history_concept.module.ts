import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryConcept } from 'src/database/entity/history_concept.entity';
import { HistoryConceptController } from './history_concept.controller';
import { HistoryConceptService } from './history_concept.service';

@Module({
  imports: [TypeOrmModule.forFeature([HistoryConcept])],
  controllers:[HistoryConceptController],
  providers: [HistoryConceptService],
  exports: [HistoryConceptService]
})
export class HistoryConceptModule {}
