import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryConcept } from 'src/database/entity/category_concept.entity';
import { ModelMold } from 'src/database/entity/model_mold.entity';
import { In, Like, Repository } from 'typeorm';
const ExcelJS = require('exceljs');

@Injectable()
export class ModelMoldService {
  constructor(
    @InjectRepository(ModelMold)
    private repository: Repository<ModelMold>,
  ) {}

  async all(body, request, res) {
    const { page, rowsPerPage, search } = body;
    const take = +rowsPerPage || 10;
    const newPage = +page || 0;
    const skip = newPage * take;
    const [data, total] = await this.repository.findAndCount({
      where: [
        {
          projectName: Like(`%${search}%`),
        },
        {
          type: Like(`%${search}%`),
        },
        {
          model: Like(`%${search}%`),
        },
        {
          description: Like(`%${search}%`),
        },
      ],
      relations: ['category'],
      take: take,
      skip: skip,
      order: { createAt: 'DESC' },
    });
    return res.status(HttpStatus.OK).send({ data, total });
  }

  async findByCategory(body, request, res) {
    const { category } = body;
    if (category) {
      const data = await this.repository.find({
        select: {
          modelID: true,
          projectName: true,
          type: true,
          model: true,
          description: true,
        },
        where: { category: { categoryId: In(category) } },
      });
      return res.status(HttpStatus.OK).send(data);
    }
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send({ message: 'Not found record!' });
  }

  async exportExcel(body, request, res) {
    const data = await this.repository.find({ relations: ['category'] });
    const workbook = new ExcelJS.Workbook();
    workbook.modified = new Date();
    const worksheet = workbook.addWorksheet('Sheet1');
    worksheet.addRow({});
    worksheet.addRow({});
    worksheet.addRow([
      '#',
      'Category',
      'Project Name',
      '구분',
      'Model',
      'Description',
      'ModelID',
    ]);
    worksheet.getRow(3).font = { bold: true };
    worksheet.getRow(3).eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '90c3a0' }, // Green color
      };
    });
    worksheet.getColumn(1).width = 5;
    worksheet.getColumn(3).width = 15;
    worksheet.getColumn(5).width = 15;
    worksheet.getColumn(6).width = 25;
    worksheet.properties.defaultRowHeight = 15;
    data.map((item, index) => {
      const dataAdd = [];
      dataAdd.push(index+1,item?.category.categoryName,item?.projectName,item?.type,item?.model,item?.description,item?.modelID);
      worksheet.addRow(dataAdd);
    });

    // // Căn giữa và thêm border cho các ô có dữ liệu
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        cell.alignment = {
          vertical: 'middle',
          horizontal: 'center',
          wrapText: true,
        };
      });
    });
    const buffer = await workbook.xlsx.writeBuffer();
    res.status(HttpStatus.OK);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=' + 'ReportABC.xlsx',
    );
    res.end(buffer);
  }

  async add(body, request, res) {
    const { project, type, model, category, description } = body;
    const newModel = new ModelMold();
    newModel.category = { categoryId: category } as CategoryConcept;
    newModel.type = type?.trim();
    newModel.model = model?.trim();
    newModel.description = description?.trim();
    newModel.projectName = project?.trim();
    newModel.createAt = new Date();
    newModel.createBy = request?.user?.userName;
    await this.repository.save(newModel);
    return res.status(HttpStatus.OK).send(newModel);
  }
  async update(body, request, res) {
    const { modelID, project, type, model, category, description } = body;

    const newModel = await this.repository.findOne({ where: { modelID } });
    if (newModel) {
      newModel.category = { categoryId: category } as CategoryConcept;
      newModel.type = type?.trim();
      newModel.model = model?.trim();
      newModel.description = description?.trim();
      newModel.projectName = project?.trim();
      newModel.updateAt = new Date();
      newModel.updateBy = request?.user?.userName;
      await this.repository.save(newModel);
      return res.status(HttpStatus.OK).send(newModel);
    }
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send({ message: 'Not found record!' });
  }
}
