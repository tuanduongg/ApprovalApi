import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryConcept } from 'src/database/entity/category_concept.entity';
import { Between, Repository } from 'typeorm';

@Injectable()
export class CategoryConceptService {
  constructor(
    @InjectRepository(CategoryConcept)
    private repository: Repository<CategoryConcept>,
  ) {}

  async all() {
    return await this.repository.find({});
  }
  async statisticReportQC(res, request, body) {
    const { startDate, endDate } = body;
    const arrCate = await this.all();
    const data = await this.repository.find({
      select: {
        categoryId: true,
        categoryName: true,
        reportQC: {
          reportId: true,
          dateReply: true,
          dateRequest: true,
          processQC: {
            processId: true,
            processName: true,
          },
        },
      },
      where: [
        {
          reportQC: {
            time: Between(startDate, endDate),
          },
        },
        {
          reportQC: [],
        },
      ],
      relations: ['reportQC', 'reportQC.processQC'],
    });
    const result = arrCate.map((cate)=>{
        const find = data.find((item)=>item?.categoryId === cate?.categoryId);
        if(!find) {
            return {...cate,reportQC:[]}         
        }
        return find;
    })
    return res.status(200).send(result);
  }
}
