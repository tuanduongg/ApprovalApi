import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ReportQCService } from './report_qc.service';
import { multerOptionConcept } from 'src/core/utils/multer.config';
import { handleFiles } from 'src/core/utils/helper';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { StorageGuard } from 'src/core/guards/storage.guard';
import { IsVNGuard } from 'src/core/guards/isVN.guard';

@Controller('report-qc')
export class ReportQCController {
  constructor(private service: ReportQCService) { }

  @UseGuards(IsVNGuard)
  @UseGuards(StorageGuard)
  @UseGuards(AuthGuard)
  @Post('/add')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        {
          name: 'images',
          maxCount: 30,
        },
        {
          name: 'fileRequest',
          maxCount: 30,
        },
        {
          name: 'fileReply',
          maxCount: 30,
        },
      ],
      multerOptionConcept,
    ),
  )
  async add(
    @Res() res: Response,
    @Req() request: Request,
    @Body() body,
    @UploadedFiles()
    {
      fileRequest,
      fileReply,
      images,
    }: {
      fileRequest: Express.Multer.File[];
      fileReply: Express.Multer.File[];
      images: Express.Multer.File[];
    },
  ) {
    const arrFileRequestPromiss = handleFiles(fileRequest, 'uploadsQC');
    const arrFileReplyPromiss = handleFiles(fileReply, 'uploadsQC');
    const arrImagePromiss = handleFiles(images, 'uploadsQC');
    const values = await Promise.all([
      arrFileRequestPromiss,
      arrFileReplyPromiss,
      arrImagePromiss,
    ]);
    let arrFileUpload = [];
    if (values[0]) {
      arrFileUpload = [...values[0]];
    }
    if (values[1]) {
      arrFileUpload = [...arrFileUpload, ...values[1]];
    }

    return await this.service.add(
      res,
      request,
      body,
      arrFileUpload,
      values[2] ?? [],
    );
  }

  @UseGuards(IsVNGuard)
  @UseGuards(StorageGuard)
  @UseGuards(AuthGuard)
  @Post('/update')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        {
          name: 'images',
          maxCount: 30,
        },
        {
          name: 'fileRequest',
          maxCount: 30,
        },
        {
          name: 'fileReply',
          maxCount: 30,
        },
      ],
      multerOptionConcept,
    ),
  )
  async update(
    @Res() res: Response,
    @Req() request: Request,
    @Body() body,
    @UploadedFiles()
    {
      fileRequest,
      fileReply,
      images,
    }: {
      fileRequest: Express.Multer.File[];
      fileReply: Express.Multer.File[];
      images: Express.Multer.File[];
    },
  ) {
    const arrFileRequestPromiss = handleFiles(fileRequest, 'uploadsQC');
    const arrFileReplyPromiss = handleFiles(fileReply, 'uploadsQC');
    const arrImagePromiss = handleFiles(images, 'uploadsQC');
    const values = await Promise.all([
      arrFileRequestPromiss,
      arrFileReplyPromiss,
      arrImagePromiss,
    ]);
    let arrFileUpload = [];
    if (values[0]) {
      arrFileUpload = [...values[0]];
    }
    if (values[1]) {
      arrFileUpload = [...arrFileUpload, ...values[1]];
    }

    return await this.service.update(
      res,
      request,
      body,
      arrFileUpload,
      values[2] ?? [],
    );
  }

  @UseGuards(IsVNGuard)
  @UseGuards(AuthGuard)
  @Post('/delete')
  async delete(@Res() res: Response, @Req() request: Request, @Body() body) {
    return await this.service.delete(res, request, body);
  }

  @UseGuards(IsVNGuard)
  @UseGuards(AuthGuard)
  @Post('/all')
  async all(@Res() res: Response, @Req() request: Request, @Body() body) {
    return await this.service.all(res, request, body);
  }

  // @UseGuards(AuthGuard)
  // @Post('/statistic')
  // async statistic(@Res() res: Response, @Req() request: Request, @Body() body) {
  //   return await this.service.statistic(res, request, body);
  // }
  // @UseGuards(AuthGuard)

  @UseGuards(IsVNGuard)
  @UseGuards(AuthGuard)
  @Post('/exportExcel-statistic')
  async exportExcelStatistic(
    @Res() res: Response,
    @Req() request: Request,
    @Body() body,
  ) {
    return await this.service.exportExcelStatistic(res, request, body);
  }
  
  @UseGuards(IsVNGuard)
  @UseGuards(AuthGuard)
  @Post('/exportExcel-report')
  async exportExcelReport(
    @Res() res: Response,
    @Req() request: Request,
    @Body() body,
  ) {
    return await this.service.exportExcelReport(res, request, body);
  }
}
