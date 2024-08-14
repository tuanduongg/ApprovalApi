import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Concept } from 'src/database/entity/concept.entity';
import { FileConcept } from 'src/database/entity/file_concept.entity';
import { In, Repository } from 'typeorm';
import * as fs from 'fs';
import { join } from 'path';
@Injectable()
export class FileConceptService {
  constructor(
    @InjectRepository(FileConcept)
    private repository: Repository<FileConcept>,
  ) {}

  async deleteMultipleFile(arrFile: FileConcept[]) {
    if (arrFile?.length > 0) {
      try {
        await this.repository.remove(arrFile);
        arrFile.map((img) => {
          const filePath = join(
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
  async delete(arrFileId: any) {
    if (arrFileId?.length > 0) {
      const arrDelete = await this.repository.find({
        where: { fileId: In(arrFileId) },
      });
      try {
        await this.repository.remove(arrDelete);
        arrDelete.map((img) => {
          const filePath = join(
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
  async findById(id: number): Promise<FileConcept> {
    return await this.repository.findOneBy({ fileId: id });
  }

  async deleteByConcept(conceptId: number) {
    const records = await this.repository.find({
      where: { concept: { conceptId } },
    });
    if (records && records.length > 0) {
      const deleted = await this.deleteMultipleFile(records);
      return deleted;
    }
    return null;
  }

  async updateENC(ids: any[]) {
    // [
    //   {
    //     fileId:1,
    //     ECN:2
    //   }
    // ]
    if (ids?.length > 0) {
      return await this.repository.save(ids);
    }
    return null;
  }
  async findByArrayId(ids: number[]) {
    return await this.repository.find({ where: { fileId: In(ids) } });
  }

  async all() {
    return await this.repository.find({});
  }

  async add(files: any, concept: Concept) {
    if (files && files?.length > 0) {
      const arrFile = [];
      files.map((file) => {
        const fileNew = new FileConcept();
        fileNew.concept = concept;
        fileNew.fileName = file?.originalName;
        fileNew.fileSize = file?.size;
        fileNew.fileUrl = file?.filePath;
        fileNew.fileExtenstion = file?.fileExtenstion;
        fileNew.ECN = file?.ECN ?? 1;
        fileNew.uploadAt = new Date();
        arrFile.push(fileNew);
      });
      const saved = await this.repository.save(arrFile);
      return saved;
    }
    return null;
  }

  deleteUploadedFiles(files: any[]): void {
    for (const file of files) {
      try {
        const filePath = join(
          process.env.UPLOAD_FOLDER || './public',
          file.urlStoreDB,
        );
        fs.unlinkSync(filePath); // Xóa file theo đường dẫn
      } catch (err) {
        console.error(`Error deleting file: ${file.path}`, err);
      }
    }
  }
}
