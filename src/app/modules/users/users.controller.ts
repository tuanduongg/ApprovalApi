import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/database/entity/user.entity';
import { AuthGuard } from '../auth/auth.guard';

@Controller('user')
export class UserController {
    constructor(
        private service: UsersService
    ) {

    }

    @Get('/fake')
    async fakse(): Promise< User> {
        
        return await this.service.fake();
    }
    @Get('/profile')
    async profile() {
        return await this.service.profile();
    }
    
    @UseGuards(AuthGuard)
    @Get('/all')
    async all() {
        return await this.service.all();
    }


}
