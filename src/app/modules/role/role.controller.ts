import { Controller, Get, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('role')
export class RoleController {
    constructor(
        private service: RoleService
    ) {

    }
    
    @UseGuards(AuthGuard)
    @Get('/all')
    async all() {
        return await this.service.all();
    }


}
