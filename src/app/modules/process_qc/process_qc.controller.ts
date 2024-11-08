import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ProcessQCService } from './process_qc.service';
import { RBACGuard } from 'src/core/guards/RBAC.guard';

@Controller('process')
export class ProcessQCController {
    constructor(
        private service: ProcessQCService
    ) {
    }
    
    @UseGuards(RBACGuard)
    @UseGuards(AuthGuard)
    @Get('/all')
    async all() {
        return await this.service.all();
    }

}
