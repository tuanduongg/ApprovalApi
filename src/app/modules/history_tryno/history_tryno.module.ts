import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryTryNoController } from './history_tryno.controller';
import { HistoryTryNoService } from './history_tryno.service';
import { HistoryTryNo } from 'src/database/entity/history_tryno.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HistoryTryNo])],
  controllers: [HistoryTryNoController],
  providers: [HistoryTryNoService],
  exports: [HistoryTryNoService],
})
export class HistoryTryNoModule {}
