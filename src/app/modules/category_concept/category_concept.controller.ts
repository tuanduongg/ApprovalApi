import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CategoryConceptService } from './category_concept.service';

@Controller('category-concept')
export class CategoryConceptController {
    constructor(
        private service: CategoryConceptService
    ) {

    }
    @UseGuards(AuthGuard)
    @Get('/all')
    async all() {
        return await this.service.all();
    }


}
