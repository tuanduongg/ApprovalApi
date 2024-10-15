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
  @Post('/change-status')
  async changeStatus(@Res() res: Response, @Req() request: Request, @Body() body) {
    return await this.service.changeStatus(body, request, res);
  }

  @UseGuards(AuthGuard)
  @Post('/delete')
  async delete(@Res() res: Response, @Req() request: Request, @Body() body) {
    return await this.service.delete(body, request, res);
  }

  @Post('/history')
  async history(
    @Res() res: Response,
    @Req() request: Request,
    @Body() body,
  ) {
    return await this.service.history(res, request, body);
  }
  
  @Post('/export-history')
  async exportHistory(
    @Res() res: Response,
    @Req() request: Request,
    @Body() body,
  ) {
    return await this.service.exportHistory(res, request, body);
  }

  @Post('/export-excel')
  async exportExcelReport(
    @Res() res: Response,
    @Req() request: Request,
    @Body() body,
  ) {
    return await this.service.exportExcel(res, request, body);
  }

  @Post('/export-excel-id')
  async exportExcelByID(
    @Res() res: Response,
    @Req() request: Request,
    @Body() body,
  ) {
    return await this.service.exportExcelByID(res, request, body);
  }
}
