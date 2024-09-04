import { HttpCode, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { FileReportQC } from 'src/database/entity/file_reportQC.entity';
import { ReportQC } from 'src/database/entity/report_qc.entity';
import {
  getExtenstionFromOriginalName,
  getFileNameWithoutExtension,
} from 'src/core/utils/helper';

@Injectable()
export class FileReportQCService {
  constructor(
    @InjectRepository(FileReportQC)
    private repository: Repository<FileReportQC>,
  ) {}

  //delete file in database and folder using array object file
  async deleteMultipleFile(arrFile: FileReportQC[]) {
    if (arrFile?.length > 0) {
      try {
        await this.repository.remove(arrFile);
        arrFile.map((img) => {
          const filePath = path.join(
            process.env.UPLOAD_FOLDER || './public',
            img.fileUrl,
          );
          fs.stat(filePath, function (err, stats) {
            if (err) {
              return console.error(err);
            }
            fs.unlink(filePath, function (err) {
              if (err) return console.log(err);
            });
          });
        });
      } catch (error) {
        return null;
      }
    }
    return null;
  }

  //delete file in database  and folder using array id
  async delete(arrFileId: any) {
    if (arrFileId?.length > 0) {
      const arrDelete = await this.repository.find({
        where: { fileId: In(arrFileId) },
      });
      try {
        await this.repository.remove(arrDelete);
        arrDelete.map((img) => {
          const filePath = path.join(
            process.env.UPLOAD_FOLDER || './public',
            img.fileUrl,
          );
          fs.stat(filePath, function (err, stats) {
            if (err) {
              return console.error(err);
            }
            fs.unlink(filePath, function (err) {
              if (err) return console.log(err);
            });
          });
        });
        return true;
      } catch (error) {
        return null;
      }
    }
    return null;
  }

  /// get all file in database
  async all() {
    return await this.repository.find({});
  }

  private getFileType(type) {
    if (!type) return '';
    let result = '';
    switch (type) {
      case 'images':
        result = 'IMG';
        break;
      case 'fileRequest':
        result = 'FRQ';
        break;
      case 'fileReply':
        result = 'FRL';
        break;

      default:
        break;
    }
    return result;
  }
  //add array files
  async add(files: any, userUpload: string = '', reportQc: ReportQC) {
    console.log('files 102', files);
    if (files && files?.length > 0) {
      const arrFile = [];
      files.map((file) => {
        const fileNew = new FileReportQC();
        const fileName = Buffer.from(file?.filename, 'latin1').toString('utf8');
        fileNew.reportQC = reportQc;
        fileNew.fileName = getFileNameWithoutExtension(fileName);
        fileNew.fileSize = file?.size;
        fileNew.fileUrl = file?.urlStoreDB;
        fileNew.fileExtenstion = getExtenstionFromOriginalName(fileName);
        fileNew.uploadAt = new Date();
        fileNew.uploadBy = userUpload;
        fileNew.type = this.getFileType(file?.fieldname);
        arrFile.push(fileNew);
      });
      const saved = await this.repository.save(arrFile);
      return saved;
    }
    return null;
  }

  //delete file in folder on error
  deleteUploadedFiles(files: any[]): void {
    for (const file of files) {
      if (file) {
        try {
          const filePath = path.join(
            process.env.UPLOAD_FOLDER || './public',
            file.urlStoreDB,
          );
          fs.unlinkSync(filePath); // Xóa file theo đường dẫn
        } catch (err) {
          console.error(`Error deleting file: ${file?.path}`, err);
        }
      }
    }
  }

  async download(res, request, body) {
    const fileID = body?.fileId;
    if (fileID) {
      const file = await this.repository.findOneBy({ fileId: fileID });

      if (file) {
        const url = file?.fileUrl;
        const filePath = path.join(
          process.env.UPLOAD_FOLDER || './public',
          url,
        );

        if (fs.existsSync(filePath)) {
          const fileStream = fs.createReadStream(filePath);

          res.set({
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': `attachment; filename="${encodeURI(file?.fileName)}"`,
          });
          res.status(200);
          fileStream.pipe(res);
          fileStream.on('error', (err) => {
            console.error('Error downloading file', err);
            return res
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .send('Error downloading file');
          });
          return res;
        } else {
          return res.status(HttpStatus.NOT_FOUND).send('File not found');
        }
      } else {
        return res.status(HttpStatus.NOT_FOUND).send('File not found');
      }
    }
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send({ message: 'Cannot found record!' });
  }

  async findByReport(res, request, body) {
    const reportId = body?.reportId;
    if (reportId) {
      const result = await this.repository.find({
        where: { reportQC: { reportId } },
      });
      return res.status(HttpStatus.OK).send(result);
    }
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send({ message: 'Not found ReportId!' });
  }
}
