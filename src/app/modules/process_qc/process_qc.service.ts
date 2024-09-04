import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProcessQC } from 'src/database/entity/process_qc.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProcessQCService {
  constructor(
    @InjectRepository(ProcessQC)
    private repository: Repository<ProcessQC>,
  ) {}

  async all() {
    return await this.repository.find({});
  }

  async getReportQCStatsByProcess() {
    const result = await this.repository
      .createQueryBuilder()
      .leftJoinAndSelect('processQC.reportQCs', 'reportQC')
      .select('processQC.processName', 'processName')
      .addSelect('COUNT(reportQC.id)', 'totalReportQC')
      .addSelect(
        'SUM(CASE WHEN reportQC.dateRequest IS NOT NULL THEN 1 ELSE 0 END)',
        'reportQCWithDateRequest',
      )
      .addSelect(
        'SUM(CASE WHEN reportQC.dateReply IS NOT NULL THEN 1 ELSE 0 END)',
        'reportQCWithDateReply',
      )
      .groupBy('processQC.processId')
      .getRawMany();

    return result;
  }
}
