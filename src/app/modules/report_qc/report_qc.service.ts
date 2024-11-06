import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryConcept } from 'src/database/entity/category_concept.entity';
import { ProcessQC } from 'src/database/entity/process_qc.entity';
import { ReportQC } from 'src/database/entity/report_qc.entity';
import {
  Between,
  FindManyOptions,
  In,
  IsNull,
  LessThanOrEqual,
  Like,
  Repository,
} from 'typeorm';
import { FileReportQCService } from '../file_reportQC/file_reportQC.service';
import { FileReportQC } from 'src/database/entity/file_reportQC.entity';
import { ProcessQCService } from '../process_qc/process_qc.service';
import {
  formatDateFromDB,
  formatNumberWithCommas,
  LIST_COL_REPORT_QC,
} from 'src/core/utils/helper';
const ExcelJS = require('exceljs');
import * as fs from 'fs';
import { join } from 'path';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ReportQCService {
  constructor(
    @InjectRepository(ReportQC)
    private repository: Repository<ReportQC>,
    private readonly processQCService: ProcessQCService,
    private readonly fileReportQCService: FileReportQCService,
  ) {}

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
  async softDelete(res, request, body) {
    const reportId = body?.reportId;
    if (reportId) {
      const dataFind = await this.repository.findOne({
        where: { reportId: reportId },
      });
      try {
        dataFind.deleteAt = new Date();
        dataFind.deleteBy = request?.user?.userName;
        await this.repository.save(dataFind);
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

  private async getAll(
    {
      search,
      startDate,
      endDate,
      category = [],
      skip = null,
      take = null,
      process = [],
    },
    media = false,
  ) {
    let arrWhere = [
      {
        code: Like(`%${search}%`),
        time: Between(startDate, endDate),
        deleteAt: IsNull(),
      },
      {
        model: Like(`%${search}%`),
        time: Between(startDate, endDate),
        deleteAt: IsNull(),
      },
      {
        plName: Like(`%${search}%`),
        time: Between(startDate, endDate),
        deleteAt: IsNull(),
      },
      {
        item: Like(`%${search}%`),
        time: Between(startDate, endDate),
        deleteAt: IsNull(),
      },
    ];

    if (category && category.length > 0) {
      arrWhere = arrWhere.map((item) => {
        return {
          ...item,
          category: {
            categoryId: In(category),
          },
        };
      });
    }
    if (process && process.length > 0) {
      arrWhere = arrWhere.map((item) => {
        return {
          ...item,
          processQC: { processId: In(process) },
        };
      });
    }

    const condition = {
      select: {
        reportId: true,
        model: true,
        plName: true,
        code: true,
        item: true,
        shift: true,
        week: true,
        time: true,
        nameNG: true,
        percentageNG: true,
        supplier: true,
        attributable: true,
        representative: true,
        techNG: true,
        tempSolution: true,
        dateRequest: true,
        dateReply: true,
        seowonStock: true,
        vendorStock: true,
        author: true,
        createAt: true,
        remark: true,
        category: {
          categoryId: true,
          categoryName: true,
        },
        processQC: {
          processId: true,
          processName: true,
        },
        media: {
          fileId: true,
          fileUrl: true,
          fileExtenstion: true,
          type: true,
        },
      },
      where: arrWhere,
      relations: ['category', 'processQC'],
      skip: skip,
      take: take,
      order: { createAt: 'DESC' },
    } as FindManyOptions<ReportQC>;
    if (media) {
      condition.relations = ['category', 'processQC', 'media'];
      condition.where = arrWhere.map((item) => ({
        ...item,
      }));
    }
    if (!skip && !take) {
      delete condition.take;
      delete condition.skip;
      const res = await this.repository.find(condition);
      return { data: res, total: 0 };
    }
    const [data, total] = await this.repository.findAndCount(condition);
    return { data, total };
  }

  async all(res, request, body) {
    const search = body?.search?.trim();
    const page = body?.page;
    const startDate = body?.startDate;
    const endDate = body?.endDate;
    const rowsPerPage = body?.rowsPerPage;
    const category = body?.category;
    const process = body?.process;
    const take = +rowsPerPage || 10;
    const newPage = +page || 0;
    const skip = newPage * take;

    const result = await this.getAll({
      search,
      startDate,
      endDate,
      category,
      skip,
      take,
      process,
    });
    return res.status(HttpStatus.OK).send(result);
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
                rowAdd[process?.processId] =
                  process?.counterRequest === 0 ? '' : process?.counterRequest;
                rowAdd['TOTAL'] = row?.sumRowRequest;
                break;
              case 1:
                rowAdd['category'] = '';
                rowAdd['type'] = '대책서(Đối sách)';
                rowAdd[process?.processId] =
                  process?.counterReply === 0 ? '' : process?.counterReply;
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

    const rowCount = data?.length; // Tùy chỉnh theo số lượng hàng bạn có

    // Bắt đầu từ dòng 2 và cứ mỗi 3 dòng sẽ tạo một nhóm
    for (let i = 2; i <= rowCount * 3; i += 3) {
      const startRow = i;
      const endRow = i + 2;
      worksheet.mergeCells(`A${startRow}:A${endRow}`);
    }

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
  async exportExcelReport(res, request, body) {
    const search = body?.search;
    const startDate = body?.startDate;
    const endDate = body?.endDate;
    const category = body?.category;
    const result = await this.getAll(
      {
        search,
        startDate,
        endDate,
        category,
      },
      true,
    );

    // const arrHeader = result[0]?.processArr.map((head) => ({
    //   header: head?.processName,
    //   key: head?.processId,
    //   width: 10,
    // }));

    const workbook = new ExcelJS.Workbook();
    workbook.modified = new Date();
    const worksheet = workbook.addWorksheet('Sheet1');
    worksheet.columns = LIST_COL_REPORT_QC;
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFADD8E6' }, // Green color
      };
    });
    worksheet.properties.defaultRowHeight = 30;
    const arrImage = [];
    for (let index = 0; index < result.data.length; index++) {
      const item = result.data[index];
      const shiftCustom = item.shift == 'D' ? 'Day' : 'Night';

      await worksheet.addRow({
        ...item,
        category: item?.category?.categoryName,
        shift: shiftCustom,
        percentageNG: item?.percentageNG + '%',
        process: item.processQC.processName,
        seowonStock: formatNumberWithCommas(item.seowonStock),
        vendorStock: formatNumberWithCommas(item.vendorStock),
        time: formatDateFromDB(item?.time, false),
        dateRequest: formatDateFromDB(item?.dateRequest, false),
        dateReply: formatDateFromDB(item?.dateReply, false),
      });
      arrImage.push({
        index,
        images: item.media.filter((row) => row.type === 'IMG'),
      });
    }
    let maxColMerge = 0;
    arrImage.map(async (item) => {
      const index = item.index;
      const lengthImages = item.images.length;
      if (lengthImages > maxColMerge) {
        maxColMerge = lengthImages;
      }
      item.images.map((img, i) => {
        if (img.type === 'IMG') {
          const colImageStart = worksheet.getColumn(
            LIST_COL_REPORT_QC.length + i,
          ).letter;
          const filePath = join(
            process.env.UPLOAD_FOLDER || './public',
            img.fileUrl,
          );
          if (fs.existsSync(filePath)) {
            const image = workbook.addImage({
              buffer: fs.readFileSync(filePath),
              extension: img.fileExtenstion,
            });

            worksheet.addImage(
              image,
              `${colImageStart}${index + 2}:${colImageStart}${index + 2}`,
            );
          }
        }
      });
    });
    const startColMer = worksheet.getColumn(LIST_COL_REPORT_QC.length).letter;
    const endColMer = worksheet.getColumn(
      LIST_COL_REPORT_QC.length - 1 + maxColMerge,
    ).letter;
    if (maxColMerge !== 0) {
      worksheet.mergeCells(`${startColMer}1:${endColMer}1`);
    }
    // worksheet.addImage(
    //   imageId,
    //   `${colImageStart}${index + 2}:${colImageStart}${index + 2}`,
    // );

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

  @Cron('5 0 * * *')
  async handleCronDeleteReportQC() {
    //6 tháng xóa 1 lần
    const numMonthDelete = process.env.MONTH_DELETE
      ? parseInt(process.env.MONTH_DELETE)
      : 6;

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - numMonthDelete);
    console.log('Start Cron job(QPN) chạy lúc 00h05 hằng ngày');
    const dataFind = await this.repository.find({
      where: { deleteAt: LessThanOrEqual(sixMonthsAgo) },
      relations: ['media'],
    });
    
    if (dataFind?.length > 0) {
      dataFind.map(async (item) => {
        const oldID = item?.reportId;
        await this.fileReportQCService.deleteMultipleFile(item.media);
        await this.repository.remove(item);
        console.log('Deleted:', { id: oldID, code: item?.code });
      });
    }
    console.log('End Cron job(QPN) chạy lúc 00h05 hằng ngày');
  }
}
