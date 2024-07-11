import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileConceptController } from './file_concept.controller';
import { FileConceptService } from './file_concept.service';
import { FileConcept } from 'src/database/entity/file_concept.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FileConcept])],
  controllers:[FileConceptController],
  providers: [FileConceptService],
  exports: [FileConceptService]
})
export class FileConceptModule {}
