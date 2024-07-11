import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Concept } from 'src/database/entity/concept.entity';
import { FileConcept } from 'src/database/entity/file_concept.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FileConceptService {
  constructor(
    @InjectRepository(FileConcept)
    private repository: Repository<FileConcept>,
  ) {}

  async all() {
    return await this.repository.find({});
  }
  async add(files: any, concept: Concept) {
    if (files && files?.length > 0) {
      const arrFile = [];
      files.map((file) => {
        console.log('file',file);
        
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
