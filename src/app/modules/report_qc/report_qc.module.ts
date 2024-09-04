import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportQC } from 'src/database/entity/report_qc.entity';
import { ReportQCController } from './report_qc.controller';
import { ReportQCService } from './report_qc.service';
import { FileReportQCModule } from '../file_reportQC/file_reportQC.module';
import { ProcessQCModule } from '../process_qc/process_qc.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReportQC]),
    FileReportQCModule,
    ProcessQCModule,
  ],
  controllers: [ReportQCController],
  providers: [ReportQCService],
  exports: [ReportQCService],
})
export class ReportQCModule {}
