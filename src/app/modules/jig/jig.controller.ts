import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { JIGService } from './jig.service';

@Controller('jig')
export class JIGController {
  constructor(private service: JIGService) {}

  @UseGuards(AuthGuard)
  @Post('/all')
  async all(@Res() res: Response, @Req() request: Request, @Body() body) {
    return await this.service.all(request, body, res);
  }

  // @UseGuards(AuthGuard)
  // @Post('/findOne')
  // async find(@Res() res: Response, @Req() request: Request, @Body() body) {
  //   return await this.service.find(body, request, res);
  // }

  @UseGuards(AuthGuard)
  @Post('/create')
  async create(@Res() res: Response, @Req() request: Request, @Body() body) {
    return await this.service.create(body, request, res);
  }

  @UseGuards(AuthGuard)
  @Post('/update')
  async update(@Res() res: Response, @Req() request: Request, @Body() body) {
    return await this.service.update(body, request, res);
  }

  @UseGuards(AuthGuard)
  @Post('/delete')
  async delete(@Res() res: Response, @Req() request: Request, @Body() body) {
    return await this.service.delete(body, request, res);
  }

  @UseGuards(AuthGuard)
  @Post('/findByAssetNo')
  async findByAssetNo(@Res() res: Response, @Req() request: Request, @Body() body) {
    return await this.service.findByAssetNo(body, request, res);
  }
}
