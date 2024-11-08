import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ConceptService } from './concept.service';
import {
  FilesInterceptor,
} from '@nestjs/platform-express';
import { Express } from 'express';
import { diskStorage } from 'multer';

import { StorageGuard } from 'src/core/guards/storage.guard';
import { handleFiles } from 'src/core/utils/helper';
import { RBACGuard } from 'src/core/guards/RBAC.guard';


@Controller('concept')
export class ConceptController {
  constructor(private service: ConceptService) { }

  @UseGuards(StorageGuard)
  @UseGuards(RBACGuard)
  @UseGuards(AuthGuard)
  @Post('/add')
  @UseInterceptors(FilesInterceptor('files', 30, {
    storage: diskStorage({
      destination: (req, file, cb) => {

        cb(null, '');
      },
      filename: (req, file, cb) => {
        cb(null, file.originalname);
      },
    }),
  }))

  async add(
    @Res() res: Response,
    @Req() request: Request,
    @Body() body,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const arrFile = await handleFiles(files);
    return await this.service.add(res, request, body, arrFile);
  }

  @UseGuards(StorageGuard)
  @UseGuards(RBACGuard)
  @UseGuards(AuthGuard)
  @Post('/update')
  @UseInterceptors(FilesInterceptor('files', 30, {
    storage: diskStorage({
      destination: (req, file, cb) => {
        cb(null, '');
      },
      filename: (req, file, cb) => {
        cb(null, file.originalname);
      },
    }),
  }))
  async update(
    @Res() res: Response,
    @Req() request: Request,
    @Body() body,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const arrFile = await handleFiles(files);
    return await this.service.update(res, request, body, arrFile);
  }



  @UseGuards(RBACGuard)
  @UseGuards(AuthGuard)
  @Post('/detail')
  async detail(@Res() res: Response, @Req() request: Request, @Body() body) {
    return await this.service.detail(res, request, body);
  }


  @UseGuards(RBACGuard)
  @UseGuards(AuthGuard)
  @Post('/all')
  async all(@Res() res: Response, @Req() request: Request, @Body() body) {
    return await this.service.all(res, request, body);
  }


  @UseGuards(RBACGuard)
  @UseGuards(AuthGuard)
  @Post('/accept')
  async accept(@Res() res: Response, @Req() request: Request, @Body() body) {
    return await this.service.accept(res, request, body);
  }


  @UseGuards(RBACGuard)
  @UseGuards(AuthGuard)
  @Post('/download')
  async download(@Res() res: Response, @Req() request: Request, @Body() body) {
    return await this.service.download(res, request, body);
  }


  @UseGuards(RBACGuard)
  @UseGuards(AuthGuard)
  @Post('/download-multiple')
  async downloadMultiple(@Res() res: Response, @Req() request: Request, @Body() body) {
    return await this.service.downloadMultiple(res, request, body);
  }


  @UseGuards(RBACGuard)
  @UseGuards(AuthGuard)
  @Post('/history')
  async history(@Res() res: Response, @Req() request: Request, @Body() body) {
    return await this.service.history(res, request, body);
  }


  @UseGuards(AuthGuard)
  @Post('/findByCode')
  async findByCode(@Res() res: Response, @Req() request: Request, @Body() body) {
    return await this.service.findByCode(res, request, body);
  }


  @UseGuards(RBACGuard)
  @UseGuards(AuthGuard)
  @Post('/delete')
  async delete(@Res() res: Response, @Req() request: Request, @Body() body) {
    return await this.service.softDelete(res, request, body);
  }


}
