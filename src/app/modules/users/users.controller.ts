import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/database/entity/user.entity';
import { AuthGuard } from '../auth/auth.guard';
import { RootGuard } from '../auth/root.guard';

@Controller('user')
export class UserController {
  constructor(private service: UsersService) {}

  @Get('/fake')
  async fakse(): Promise<User> {
    return await this.service.fake();
  }
  @Get('/profile')
  async profile() {
    return await this.service.profile();
  }

  @UseGuards(AuthGuard)
  @Get('/public')
  async public() {
    return await this.service.public();
  }
  @UseGuards(RootGuard)
  @UseGuards(AuthGuard)
  @Post('/all')
  async all(@Res() res: Response, @Req() request: Request, @Body() body) {
    return await this.service.all(request, body, res);
  }

  @UseGuards(RootGuard)
  @UseGuards(AuthGuard)
  @Post('/find')
  async find(@Res() res: Response, @Req() request: Request, @Body() body) {
    return await this.service.find(body, request, res);
  }

  @UseGuards(RootGuard)
  @UseGuards(AuthGuard)
  @Post('/create')
  async create(@Res() res: Response, @Req() request: Request, @Body() body) {
    return await this.service.create(body, request, res);
  }
  @UseGuards(AuthGuard)
  @Get('/checkRole')
  async checkRole(@Res() res: Response, @Req() request: Request, @Body() body) {
    return await this.service.checkRole(body, request, res);
  }

  @UseGuards(AuthGuard)
  @Post('/changePassword')
  async changePassword(
    @Res() res: Response,
    @Req() request: Request,
    @Body() body,
  ) {
    return await this.service.changePassword(body, request, res);
  }

  @UseGuards(RootGuard)
  @UseGuards(AuthGuard)
  @Post('/update')
  async update(@Res() res: Response, @Req() request: Request, @Body() body) {
    return await this.service.update(body, request, res);
  }
  


  @UseGuards(AuthGuard)
  @Get('/get-storage')
  async getStorage(@Res() res: Response) {
    return await this.service.getStorage(res);
  }
}
