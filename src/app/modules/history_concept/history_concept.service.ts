import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Concept } from 'src/database/entity/concept.entity';
import { HistoryConcept } from 'src/database/entity/history_concept.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HistoryConceptService {
  constructor(
    @InjectRepository(HistoryConcept)
    private repository: Repository<HistoryConcept>,
  ) { }

  async all() {
    return await this.repository.find({});
  }
  async findByConcept(conceptId: number) {
    return await this.repository.find({ where: { concept: { conceptId: conceptId } }, order: { historyTime: 'DESC' } });
  }
  async add(concept: Concept, data: any, request) {
    const his = new HistoryConcept();
    his.concept = concept;
    his.historyTime = new Date();
    his.historyType = data?.type;
    his.historyRemark = data?.historyRemark;
    his.historyUsername = request?.user?.userName;
    return await this.repository.save(his);
  }
}
