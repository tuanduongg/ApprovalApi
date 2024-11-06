import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DetailMoldBefore } from 'src/database/entity/detail_mold_before.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DetailMoldBeforeService {
  constructor(
    @InjectRepository(DetailMoldBefore)
    private repository: Repository<DetailMoldBefore>,
  ) {}

  async add(body, request, res) {
    const {
      type,
      project,
      model,
      productName,
      level,
      asset,
      cvt,
      massProduct,
      currentLocation,
      date,
    } = body;
    const newModel = new DetailMoldBefore();
    newModel.type = type;
    newModel.project = project;
    newModel.model = model;
    newModel.productName = productName;
    newModel.level = level;
    newModel.asset = asset;
    newModel.cvt = cvt;
    newModel.massProduct = massProduct;
    newModel.currentLocation = currentLocation;
    newModel.date = date;

    newModel.createBy = request?.user?.userName;
    newModel.createAt = new Date();
    await this.repository.save(newModel);
    res.status(HttpStatus.OK).send(newModel);
  }

  async update(body, request, res) {
    const {
      beforeID,
      type,
      project,
      model,
      productName,
      level,
      asset,
      cvt,
      massProduct,
      currentLocation,
      date,
    } = body;
    const newModel = await this.repository.findOneBy({ beforeID });
    if (newModel) {
      newModel.type = type;
      newModel.project = project;
      newModel.model = model;
      newModel.productName = productName;
      newModel.level = level;
      newModel.asset = asset;
      newModel.cvt = cvt;
      newModel.massProduct = massProduct;
      newModel.currentLocation = currentLocation;
      newModel.date = date;

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
    const { beforeID } = body;
    const newModel = await this.repository.findOneBy({ beforeID });
    if (newModel) {
      await this.repository.delete({ beforeID });
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
    const { data, total } = await this.getAll(body);
    return res.status(HttpStatus.OK).send({ data, total });
  }
}
