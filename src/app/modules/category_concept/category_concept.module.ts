import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryConcept } from 'src/database/entity/category_concept.entity';
import { CategoryConceptController } from './category_concept.controller';
import { CategoryConceptService } from './category_concept.service';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryConcept])],
  controllers:[CategoryConceptController],
  providers: [CategoryConceptService],
  exports: [CategoryConceptService]
})
export class CategoryConceptModule {}
