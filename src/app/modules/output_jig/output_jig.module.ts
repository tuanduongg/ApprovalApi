import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OutputJig } from 'src/database/entity/output_jig.entity';
import { OutputJigController } from './output_jig.controller';
import { OutputJigService } from './output_jig.service';
import { CompanyModule } from '../company/company.module';
import { HistoryOutJigModule } from '../history_out_jig/history_concept.module';
import { HistoryTryNoModule } from '../history_tryno/history_tryno.module';
import { DetailMoldAfterModule } from '../detail_mold_after/detail_mold_after.module';
import { DetailMoldBeforeModule } from '../detail_mold_before/detail_mold_before.module';

@Module({
  imports: [TypeOrmModule.forFeature([OutputJig]),CompanyModule,HistoryOutJigModule,HistoryTryNoModule,DetailMoldAfterModule,DetailMoldBeforeModule],
  controllers: [OutputJigController],
  providers: [OutputJigService],
  exports: []
})
export class OutputJigModule { }
