import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HistoryOutJig } from 'src/database/entity/history_out_jig.entity';
import { OutputJig } from 'src/database/entity/output_jig.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HistoryOutJigService {
  constructor(
    @InjectRepository(HistoryOutJig)
    private repository: Repository<HistoryOutJig>,
  ) {}

  async all() {
    return await this.repository.find({});
  }

  async delete(outputJigID: number) {
    await this.repository.delete({ outputJig: { outputJigID } });
    return true;
  }
  async findByOutputJig(outputJigID: number) {
    return await this.repository.find({
      where: { outputJig: { outputJigID: outputJigID } },
      order: { historyTime: 'DESC' },
    });
  }

 
  async add(model: OutputJig, data: any, request) {
    const his = new HistoryOutJig();
    his.outputJig = model;
    his.historyTime = new Date();
    his.historyType = data?.historyType;
    his.historyRemark = data?.historyRemark;
    his.historyUsername = request?.user?.userName;
    return await this.repository.save(his);
  }
}
