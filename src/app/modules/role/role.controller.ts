import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { AuthGuard } from '../auth/auth.guard';
import { RootGuard } from '../auth/root.guard';

@Controller('role')
export class RoleController {
  constructor(private service: RoleService) {}

  @UseGuards(RootGuard)
  @UseGuards(AuthGuard)
  @Get('/all')
  async all() {
    return await this.service.all();
  }

  @UseGuards(RootGuard)
  @UseGuards(AuthGuard)
  @Post('/update')
  async update(@Res() res: Response, @Body() body) {
    return await this.service.update(res, body);
  }
}
