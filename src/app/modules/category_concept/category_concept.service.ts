import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryConcept } from 'src/database/entity/category_concept.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryConceptService {

    constructor(
        @InjectRepository(CategoryConcept)
        private repository: Repository<CategoryConcept>,
    ) { }

    async all() {
        return await this.repository.find({});
    }
}
