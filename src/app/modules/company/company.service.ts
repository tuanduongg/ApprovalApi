import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/database/entity/company.entity';
import { In, Like, Repository } from 'typeorm';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private repository: Repository<Company>,
  ) { }

  async all(body, request, res) {
    const {
      page,
      rowsPerPage,
      search
    } = body;
    const take = +rowsPerPage || 10;
    const newPage = +page || 0;
    const skip = newPage * take;
    const [data, total] = await this.repository.findAndCount({
      where: [
        {
          companyCode: Like(`%${search}%`)
        },
        {
          companyName: Like(`%${search}%`)
        }
      ],
      take: take,
      skip: skip,
      order: { createAt: 'DESC' }
    });
    return res.status(HttpStatus.OK).send({ data, total });
  }

  async add(body, request, res) {
    const {
      codeCompany,
      nameCompany,
    } = body;
    const checkCode = await this.repository.findOne({ where: { companyCode: codeCompany } });
    if (checkCode) {
      return res.status(HttpStatus.BAD_REQUEST).send({ message: 'Code existing!' });
    }
    const newModel = new Company();
    newModel.companyCode = codeCompany?.trim();
    newModel.companyName = nameCompany?.trim();
    newModel.createAt = new Date();
    newModel.createBy = request?.user?.userName;
    await this.repository.save(newModel);
    return res.status(HttpStatus.OK).send(newModel);
  }
  async update(body, request, res) {
    const {
      companyID,
      codeCompany,
      nameCompany,
    } = body;
    const checkCode = await this.repository.findOne({ where: { companyCode: codeCompany } });
    if (checkCode && checkCode?.companyID !== companyID) {
      return res.status(HttpStatus.BAD_REQUEST).send({ message: 'Code existing!' });
    }
    const newModel = await this.repository.findOne({ where: { companyID } });
    if (newModel) {
      if (codeCompany?.trim()?.toLocaleLowerCase() !== newModel.companyCode.toLocaleLowerCase()) {
        newModel.companyCode = codeCompany?.trim();
      }
      newModel.companyName = nameCompany?.trim();
      newModel.updateAt = new Date();
      newModel.updateBy = request?.user?.userName;
      await this.repository.save(newModel);
      return res.status(HttpStatus.OK).send(newModel);
    }
    return res.status(HttpStatus.BAD_REQUEST).send({ message: 'Not found record!' });
  }


  async findByCode(code: Array<string>) {
    if (code?.length > 0) {
      const find = await this.repository.findBy({ companyCode: In(code) });
      return find;
    }
    return [];
  }
}
