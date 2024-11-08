import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { FileConceptService } from './file_concept.service';
import { RBACGuard } from 'src/core/guards/RBAC.guard';
@Controller('file-concept')
export class FileConceptController {
    constructor(
        private service: FileConceptService
    ) {

    }
    @UseGuards(RBACGuard)
    @UseGuards(AuthGuard)
    @Get('/all')
    async all() {
        return await this.service.all();
    }


}
