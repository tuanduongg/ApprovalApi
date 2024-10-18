import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HistoryTryNo } from 'src/database/entity/history_tryno.entity';
import { OutputJig } from 'src/database/entity/output_jig.entity';
import { IsNull, MoreThanOrEqual, Not, Repository } from 'typeorm';

@Injectable()
export class HistoryTryNoService {
  constructor(
    @InjectRepository(HistoryTryNo)
    private repository: Repository<HistoryTryNo>,
  ) { }

  async all() {
    return await this.repository.find({});
  }

  async inCrementTryNum(outputJigID: number, departEdit: number, request: any) {
    let newTryNum = 1;
    const oldRecord = await this.repository.findOne({
      where: {
        outputJig: { outputJigID },

        currentTry: true,
      },
      relations: ['modificationCompany'],
    });
    const oldTryNum = oldRecord?.tryNum || 0;

    if (oldRecord) {
      newTryNum = oldTryNum + 1;
      oldRecord.currentTry = false;
      oldRecord.modificationCompany = oldRecord?.modificationCompany;
    }
    try {
      const promiss1 = this.repository.save(oldRecord);
      const promiss2 = this.add(
        { outputJigID } as OutputJig,
        {
          modificationCompany: oldRecord?.modificationCompany || null,
          tryNum: newTryNum,
          departEdit: departEdit,
          currentTry: true,
          remark: '',
          createAt: new Date(),
          createBy: request?.user?.userName,
        },
        request,
      );
      await Promise.all([promiss1, promiss2]);
      return {
        newTryNum,
        oldTryNum,
      };
    } catch (error) {
      return null;
    }
  }
  async delete(outputJigID: number) {
    await this.repository.delete({ outputJig: { outputJigID } });
    return true;
  }

  async add(model: OutputJig, data: any, request) {
    const his = new HistoryTryNo();
    his.outputJig = model;
    his.modificationCompany = data?.modificationCompany || null;
    his.outputEdit = data?.outputEdit;
    his.wearingPlan = data?.wearingPlan;
    his.receivingCompleted = data?.receivingCompleted;
    his.remark = data?.remark;
    his.departEdit = data?.departEdit || 1;
    his.tryNum = data?.tryNum;
    his.currentTry = data?.currentTry || false;
    his.createAt = new Date();
    his.createBy = request?.user?.userName;
    return await this.repository.save(his);
  }

  async update(data: any, request: any) {
    const his = await this.repository.findOne({
      where: { historyTryNoId: data?.historyTryNoId },
    });
    if (his) {
      his.outputJig = { outputJigID: data?.outputJigID } as OutputJig;
      his.modificationCompany = data?.modificationCompany;
      his.outputEdit = data?.outputEdit;
      his.wearingPlan = data?.wearingPlan;
      his.receivingCompleted = data?.receivingCompleted;
      his.remark = data?.remark;
      his.tryNum = data?.tryNum;
      his.currentTry = data?.currentTry || false;
      his.updateAt = new Date();
      his.updateBy = request?.user?.userName;
      const saved = await this.repository.save(his);
      return saved;
    }
    return null;
  }

  async findByOutputJig(body, res) {
    const { outputJigID } = body;
    if (outputJigID) {
      const result = await this.repository.find({
        select: {
          historyTryNoId: true,
          tryNum: true,
          currentTry: true,
          receivingCompleted: true,
          outputEdit: true,
          wearingPlan: true,
          departEdit: true,
          remark: true,
          createAt: true,
          modificationCompany: {
            companyCode: true,
            companyName: true,
          },
        },
        where: { outputJig: { outputJigID }, tryNum: MoreThanOrEqual(1) },
        relations: ['modificationCompany'],
        order: { createAt: 'DESC' },
      });
      return res.status(HttpStatus.OK).send(result);
    }
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send({ message: 'Not found record!' });
  }
}
