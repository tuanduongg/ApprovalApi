import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileReportQC } from 'src/database/entity/file_reportQC.entity';
import { FileReportQCController } from './file_reportQC.controller';
import { FileReportQCService } from './file_reportQC.service';

@Module({
  imports: [TypeOrmModule.forFeature([FileReportQC])],
  controllers:[FileReportQCController],
  providers: [FileReportQCService],
  exports: [FileReportQCService]
})
export class FileReportQCModule {}
