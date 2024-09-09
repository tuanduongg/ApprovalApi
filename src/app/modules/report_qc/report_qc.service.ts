import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryConcept } from 'src/database/entity/category_concept.entity';
import { ProcessQC } from 'src/database/entity/process_qc.entity';
import { ReportQC } from 'src/database/entity/report_qc.entity';
import { Like, Repository } from 'typeorm';
import { FileReportQCService } from '../file_reportQC/file_reportQC.service';
import { FileReportQC } from 'src/database/entity/file_reportQC.entity';
import { ProcessQCService } from '../process_qc/process_qc.service';
const ExcelJS = require('exceljs');

@Injectable()
export class ReportQCService {
  constructor(
    @InjectRepository(ReportQC)
    private repository: Repository<ReportQC>,
    private readonly processQCService: ProcessQCService,
    private readonly fileReportQCService: FileReportQCService,
  ) { }

  async add(res, request, body, arrFile = [], arrImage = []) {
    const dataString = body?.data;
    const dataObj = JSON.parse(dataString);
    const {
      shift,
      week,
      date,
      category,
      ngName,
      percentage,
      code,
      process,
      model,
      supplier,
      plName,
      attributable,
      item,
      representative,
      seowonStock,
      vendorStock,
      tempSolution,
      techNg,
      remark,
      requestDate,
      replyDate,
      author,
    } = dataObj;
    const userRequest = request?.user;

    const newReport = new ReportQC();
    newReport.shift = shift;
    newReport.week = parseInt(week);
    newReport.time = date;
    newReport.category = { categoryId: category } as CategoryConcept;
    newReport.nameNG = ngName;
    newReport.percentageNG = percentage;
    newReport.code = code;
    newReport.processQC = { processId: process } as ProcessQC;
    newReport.model = model;
    newReport.supplier = supplier;
    newReport.plName = plName;
    newReport.author = author;
    newReport.attributable = attributable;
    newReport.item = item;
    newReport.representative = representative;
    newReport.seowonStock = parseInt(seowonStock, 10);
    newReport.vendorStock = parseInt(vendorStock, 10);
    newReport.tempSolution = tempSolution;
    newReport.techNG = techNg;
    newReport.remark = remark;
    newReport.dateRequest = requestDate;
    newReport.dateReply = replyDate;
    newReport.createBy = userRequest?.userName;
    newReport.createAt = new Date();

    // add files
    //

    const listFileAdd = arrFile.concat(arrImage);

    try {
      await this.repository.save(newReport);
      if (listFileAdd && listFileAdd?.length > 0) {
        await this.fileReportQCService.add(
          listFileAdd,
          userRequest?.userName,
          newReport,
        );
      }
      return res.status(HttpStatus.OK).send(newReport);
    } catch (error) {
      this.fileReportQCService.deleteUploadedFiles(listFileAdd);
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: 'Fail while saving!' });
    }
  }

  async update(res, request, body, arrFile = [], arrImage = []) {
    const dataString = body?.data;
    const dataObj = JSON.parse(dataString);
    const imagesDelete = dataObj?.imagesDelete;
    const filesDelete = dataObj?.filesDelete;
    const listFileAdd = arrFile.concat(arrImage);
    console.log('arrFile 105', arrFile);


    const {
      shift,
      week,
      date,
      category,
      ngName,
      percentage,
      code,
      process,
      model,
      supplier,
      plName,
      attributable,
      item,
      representative,
      seowonStock,
      vendorStock,
      tempSolution,
      techNg,
      remark,
      requestDate,
      replyDate,
      author,
    } = dataObj;
    const userRequest = request?.user;
    if (!dataObj?.reportId) {
      this.fileReportQCService.deleteUploadedFiles(listFileAdd);
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: 'Cannot found record ID!' });
    }
    const newReport = await this.repository.findOneBy({
      reportId: dataObj?.reportId,
    });
    if (!newReport) {
      this.fileReportQCService.deleteUploadedFiles(listFileAdd);
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: 'Cannot found record!' });
    }
    newReport.shift = shift;
    newReport.week = parseInt(week);
    newReport.time = date;
    newReport.category = { categoryId: category } as CategoryConcept;
    newReport.nameNG = ngName;
    newReport.percentageNG = percentage;
    newReport.code = code;
    newReport.author = author;
    newReport.processQC = { processId: process } as ProcessQC;
    newReport.model = model;
    newReport.supplier = supplier;
    newReport.plName = plName;
    newReport.attributable = attributable;
    newReport.item = item;
    newReport.representative = representative;
    newReport.seowonStock = parseInt(seowonStock, 10);
    newReport.vendorStock = parseInt(vendorStock, 10);
    newReport.tempSolution = tempSolution;
    newReport.techNG = techNg;
    newReport.remark = remark;
    newReport.dateRequest = requestDate;
    newReport.dateReply = replyDate;
    newReport.updateby = userRequest?.userName;
    newReport.updateAt = new Date();

    // add files
    //

    try {
      await this.repository.save(newReport);
      if (imagesDelete || filesDelete) {
        await this.fileReportQCService.deleteMultipleFile(
          imagesDelete.concat(filesDelete) as FileReportQC[],
        );
      }
      if (listFileAdd && listFileAdd?.length > 0) {
        await this.fileReportQCService.add(
          listFileAdd,
          userRequest?.userName,
          newReport,
        );
      }
      return res.status(HttpStatus.OK).send(newReport);
    } catch (error) {
      console.log('err 190', error);

      this.fileReportQCService.deleteUploadedFiles(listFileAdd);
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: 'Fail while update!' });
    }
  }

  async delete(res, request, body) {
    const reportId = body?.reportId;
    if (reportId) {
      const dataFind = await this.repository.findOne({
        where: { reportId: reportId },
        relations: ['media'],
      });
      try {
        await this.fileReportQCService.deleteMultipleFile(dataFind.media);
        await this.repository.remove(dataFind);
        return res
          .status(HttpStatus.OK)
          .send({ message: 'Delete successful!' });
      } catch (error) {
        console.log('err', error);
      }
    }
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send({ message: 'Cannot found ID!' });
  }

  async all(res, request, body) {
    const search = body?.search;
    const page = body?.page;
    const rowsPerPage = body?.rowsPerPage;
    const take = +rowsPerPage || 10;
    const newPage = +page || 0;
    const skip = newPage * take;

    const [data, total] = await this.repository.findAndCount({
      where: [
        {
          code: Like(`%${search}%`),
        },
        {
          model: Like(`%${search}%`),
        },
        {
          plName: Like(`%${search}%`),
        },
        {
          item: Like(`%${search}%`),
        },
        {
          author: Like(`%${search}%`),
        },
      ],
      relations: ['category', 'processQC'],
      skip: skip,
      take: take,
      order: { createAt: 'DESC' },
    });
    return res.status(HttpStatus.OK).send({ data, total });
  }

  async statistic(res, request, body) {
    const data = await this.repository
      .createQueryBuilder('reportQC')
      .select('reportQC.processQC.processId', 'processId')
      .addSelect('COUNT(reportQC.dateRequest)', 'dateRequestCount')
      .addSelect('COUNT(reportQC.dateReply)', 'dateReplyCount')
      .groupBy('reportQC.processQC.processId')
      .getRawMany();
    return res?.status(200).send(data);
  }
  async exportExcelStatistic(res, request, body) {
    const data = body?.data;
    if (!data) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: 'Not found data!' });
    }
    const arrHeader = data[0]?.processArr.map((head) => ({
      header: head?.processName,
      key: head?.processId,
      width: 10,
    }));

    const workbook = new ExcelJS.Workbook();
    workbook.modified = new Date();
    const worksheet = workbook.addWorksheet('Sheet1');
    worksheet.columns = [
      { header: '카테고리', key: 'category', width: 20 },
      { header: '구분', key: 'type', width: 20 },
    ]
      .concat(arrHeader)
      .concat([{ header: 'Total', key: 'TOTAL', width: 10 }]);
    // In đậm header
    worksheet.getRow(1).font = { bold: true };

    data.map((row) => {
      const processArr = row?.processArr;
      if (processArr?.length > 0) {
        for (let index = 0; index < 3; index++) {
          const rowAdd: any = {};
          processArr.map((process) => {
            rowAdd[process?.processId] = process;
            switch (index) {
              case 0:
                rowAdd['category'] = row?.categoryName;
                rowAdd['type'] = '통보서(Thông báo)';
                rowAdd[process?.processId] = process?.counterRequest;
                rowAdd['TOTAL'] = row?.sumRowRequest;
                break;
              case 1:
                rowAdd['category'] = '';
                rowAdd['type'] = '대책서(Đối sách)';
                rowAdd[process?.processId] = process?.counterReply;
                rowAdd['TOTAL'] = row?.sumRowReply;
                break;
              case 2:
                rowAdd['category'] = '';
                rowAdd['type'] = '완료율(Tỷ lệ)';
                rowAdd[process?.processId] = process?.percetageCel + '%';
                rowAdd['TOTAL'] = row?.percentage + '%';
                break;

              default:
                break;
            }
          });
          worksheet.addRow(rowAdd);
        }
      }
    });

    // Căn giữa và thêm border cho các ô có dữ liệu
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell, colNumber) => {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
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
      'attachment; filename=' + 'Report.xlsx',
    );
    res.end(buffer);
  }
}
