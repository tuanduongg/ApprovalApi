import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ProcessQCService } from './process_qc.service';

@Controller('process')
export class ProcessQCController {
    constructor(
        private service: ProcessQCService
    ) {
    }
    
    @UseGuards(AuthGuard)
    @Get('/all')
    async all() {
        return await this.service.all();
    }

}
