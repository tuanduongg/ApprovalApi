import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DetailMoldAfter } from 'src/database/entity/detail_mold_after.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DetailMoldAfterService {
  constructor(
    @InjectRepository(DetailMoldAfter)
    private repository: Repository<DetailMoldAfter>,
  ) {}

  async add(body, request, res) {
    const { no, modification, schedule, detailEdit, division } = body;
    const newModel = new DetailMoldAfter();
    newModel.no = no;
    newModel.modification = modification;
    newModel.schedule = schedule;
    newModel.detailEdit = detailEdit;
    newModel.division = division;

    newModel.createBy = request?.user?.userName;
    newModel.createAt = new Date();
    await this.repository.save(newModel);
    res.status(HttpStatus.OK).send(newModel);
  }

  async update(body, request, res) {
    const { afterID, no, modification, schedule, detailEdit, division } = body;
    const newModel = await this.repository.findOneBy({ afterID });
    if (newModel) {
      newModel.no = no;
      newModel.modification = modification;
      newModel.schedule = schedule;
      newModel.detailEdit = detailEdit;
      newModel.division = division;

      newModel.updateBy = request?.user?.userName;
      newModel.updateAt = new Date();
      await this.repository.save(newModel);
      return res.status(HttpStatus.OK).send(newModel);
    }
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send({ message: 'Not found record!' });
  }

  async delete(body, request, res) {
    const { afterID } = body;
    const newModel = await this.repository.findOneBy({ afterID });
    if (newModel) {
      await this.repository.delete({ afterID });
      return res.status(HttpStatus.OK).send({ message: 'Deleted successful!' });
    }
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send({ message: 'Not found record!' });
  }
  async getAll(body, showPaginate: boolean = true) {
    const { page, rowsPerPage } = body;
    const take = +rowsPerPage || 10;
    const newPage = +page || 0;
    const skip = newPage * take;
    if (showPaginate) {
      const [data, total] = await this.repository.findAndCount({
        take: take,
        skip: skip,
        order: { createAt: 'DESC' },
      });

      return { data, total };
    } else {
      const result = await this.repository.find({
        order: { createAt: 'DESC' },
      });
      return { data: result, total: 0 };
    }
  }
  async all(body, request, res) {
    const data = await this.getAll(body);
    return res.status(HttpStatus.OK).send(data);
  }
}
