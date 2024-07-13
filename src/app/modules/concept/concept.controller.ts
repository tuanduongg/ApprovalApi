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
import { FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@Controller('concept')
export class ConceptController {
  constructor(private service: ConceptService) {}

  @UseGuards(AuthGuard)
  @Post('/add')
  @UseInterceptors(FilesInterceptor('files'))
  async add(
    @Res() res: Response,
    @Req() request: Request,
    @Body() body,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return await this.service.add(res, request, body, files);
  }
  @UseGuards(AuthGuard)
  @Post('/update')
  @UseInterceptors(FilesInterceptor('files'))
  async update(
    @Res() res: Response,
    @Req() request: Request,
    @Body() body,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return await this.service.update(res, request, body, files);
  }
  @UseGuards(AuthGuard)
  @Post('/detail')
  async detail(@Res() res: Response, @Req() request: Request, @Body() body) {
    return await this.service.detail(res, request, body);
  }
  @UseGuards(AuthGuard)
  @Post('/all')
  async all(@Res() res: Response, @Req() request: Request, @Body() body) {
    return await this.service.all(res, request, body);
  }
  @UseGuards(AuthGuard)
  @Post('/accept')
  async accept(@Res() res: Response, @Req() request: Request, @Body() body) {
    return await this.service.accept(res, request, body);
  }
}
