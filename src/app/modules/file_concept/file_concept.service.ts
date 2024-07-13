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

  async delete(arrFileId: any) {
    if (arrFileId?.length > 0) {
      const arrDelete = await this.repository.find({
        where: { fileId: In(arrFileId) },
      });
      try {
        await this.repository.remove(arrDelete);
        arrDelete.map((img) => {
          const filePath = join(__dirname, '..', 'public', img.fileUrl).replace('dist\\app\\modules\\','');
          console.log('filePath', filePath);
          fs.stat(filePath, function (err, stats) {
            if (err) {
              return console.error(err);
            }
            fs.unlink(filePath, function (err) {
              if (err) return console.log(err);
              console.log('file deleted successfully');
            });
          });
        });
      } catch (error) {
        return null;
      }
    }
    return null;
  }
  async all() {
    return await this.repository.find({});
  }
  async add(files: any, concept: Concept) {
    if (files && files?.length > 0) {
      const arrFile = [];
      files.map((file) => {
        console.log('file', file);

        const fileNew = new FileConcept();
        fileNew.concept = concept;
        fileNew.fileName = file?.originalName;
        fileNew.fileSize = file?.size;
        fileNew.fileUrl = file?.filePath;
        fileNew.fileExtenstion = file?.fileExtenstion;
        fileNew.uploadAt = new Date();
        arrFile.push(fileNew);
      });
      const saved = await this.repository.save(arrFile);
      return saved;
    }
    return null;
  }
}
