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
import * as path from 'path';

import * as fs from 'fs';


@Controller('concept')
export class ConceptController {
  constructor(private service: ConceptService) { }

  // @UseGuards(AuthGuard)
  // @Post('/add')
  // // @UseInterceptors(FilesInterceptor('files'))
  // @UseInterceptors(FilesInterceptor('files', 30, multerOptions))
  // async add(
  //   @Res() res: Response,
  //   @Req() request: Request,
  //   @Body() body,
  //   @UploadedFiles() files: Express.Multer.File[],
  // ) {
  //   return await this.service.add(res, request, body, files);
  // }
  @UseGuards(AuthGuard)
  @Post('/add')
  @UseInterceptors(FilesInterceptor('files', 30, {
    storage: diskStorage({
      destination: (req, file, cb) => {
        console.log('file',file);
        
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
    const arrFile = await this.handleFiles(files);
    return await this.service.add(res, request, body, arrFile);
  }
  private getExtenstionFromOriginalName(originalname: string) {
    const ext = originalname.split('.').pop();
    return ext ? ext : '';
  }
  async handleFiles(files: Express.Multer.File[]) {
    
    const arrFile = files.map((file) => {

      try {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
        const day = String(now.getDate()).padStart(2, '0');
        const folderUpload = path.join('uploads', `${day}${month}${year}`);
        const uploadPath = path.join('./public', folderUpload);
        // Tạo thư mục nếu chưa tồn tại
        fs.mkdirSync(uploadPath, { recursive: true });

        const uniqueSuffix = Array(32)
          .fill(null)
          .map(() => Math.round(Math.random() * 16).toString(16))
          .join('');
        const extension = this.getExtenstionFromOriginalName(file.originalname);
        const fileName = `${uniqueSuffix}${extension ? '.' + extension : ''}`;
        const urlStoreDB = path.join(folderUpload, fileName);
        const targetPath = path.join(uploadPath, fileName);

        const readableStream = fs.createReadStream(file.path);
        const writableStream = fs.createWriteStream(targetPath);

        readableStream.pipe(writableStream);

        readableStream.on('error', (error) => {
          console.error('Error reading file:', error);
          fs.stat(file.path, function (err, stats) {
            if (err) {
              return console.error(err);
            }
            fs.unlinkSync(file.path); // Xóa tệp tạm thời nếu có lỗi
          });
        });

        writableStream.on('error', (error) => {
          console.error('Error writing file:', error);
          fs.stat(file.path, function (err, stats) {
            if (err) {
              return console.error(err);
            }
            fs.unlinkSync(file.path); // Xóa tệp tạm thời nếu có lỗi
          });
          fs.stat(file.path, function (err, stats) {
            if (err) {
              return console.error(err);
            }
            fs.unlinkSync(targetPath); // Xóa tệp đích nếu có lỗi
          });
        });

        writableStream.on('finish', () => {
          fs.stat(file.path, function (err, stats) {
            if (err) {
              return console.error(err);
            }
            fs.unlinkSync(file.path); // Xóa tệp tạm thời khi barn ghi hoan tat
          });
        });
        return { ...file, urlStoreDB };
      } catch (error) {
        console.error('Error handling file:', error);
        throw error;
      }
    })

    return arrFile;
  }

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
    const arrFile = await this.handleFiles(files);

    return await this.service.update(res, request, body, arrFile);
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

  @UseGuards(AuthGuard)
  @Post('/download')
  async download(@Res() res: Response, @Req() request: Request, @Body() body) {
    return await this.service.download(res, request, body);
  }

  @UseGuards(AuthGuard)
  @Post('/download-multiple')
  async downloadMultiple(@Res() res: Response, @Req() request: Request, @Body() body) {
    return await this.service.downloadMultiple(res, request, body);
  }

  @UseGuards(AuthGuard)
  @Post('/history')
  async history(@Res() res: Response, @Req() request: Request, @Body() body) {
    return await this.service.history(res, request, body);
  }

  @UseGuards(AuthGuard)
  @Post('/delete')
  async delete(@Res() res: Response, @Req() request: Request, @Body() body) {
    return await this.service.delete(res, request, body);
  }
}
