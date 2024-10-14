import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryOutJigController } from './history_concept.controller';
import { HistoryOutJigService } from './history_concept.service';
import { HistoryOutJig } from 'src/database/entity/history_out_jig.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HistoryOutJig])],
  controllers:[HistoryOutJigController],
  providers: [HistoryOutJigService],
  exports: [HistoryOutJigService]
})
export class HistoryOutJigModule {}
