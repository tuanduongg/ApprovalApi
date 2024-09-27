import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import {   OutputJigService } from './output_jig.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('output-jig')
export class OutputJigController {
  constructor(private service: OutputJigService) { }

  @UseGuards(AuthGuard)
  @Post('/all')
  async all(@Res() res: Response, @Req() request: Request, @Body() body) {
    return await this.service.all(body, request, res);
  }


  @UseGuards(AuthGuard)
  @Post('/add')
  async add(@Res() res: Response, @Req() request: Request, @Body() body) {
    return await this.service.add(body, request, res);
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
}
