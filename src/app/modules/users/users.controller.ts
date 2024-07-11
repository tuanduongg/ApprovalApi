import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
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
    @UseGuards(AuthGuard)
    @Post('/find')
    async find(@Res() res: Response, @Req() request: Request, @Body() body) {
        return await this.service.find(body,request,res);
    }

    @UseGuards(AuthGuard)
    @Post('/create')
    async create(@Res() res: Response, @Req() request: Request, @Body() body) {
        return await this.service.create(body,request,res);
    }
    @UseGuards(AuthGuard)
    @Post('/update')
    async update(@Res() res: Response, @Req() request: Request, @Body() body) {
        return await this.service.update(body,request,res);
    }


}
