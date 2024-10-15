import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { FileReportQCService } from './file_reportQC.service';
import { AuthGuard } from '../auth/auth.guard';
import { RootGuard } from '../auth/root.guard';

@Controller('file-report-qc')
export class FileReportQCController {
  constructor(private service: FileReportQCService) { }

  @UseGuards(AuthGuard)
  @Post('/findByReportId')
  async findByReportId(
    @Res() res: Response,
    @Req() request: Request,
    @Body() body,
  ) {
    return await this.service.findByReport(res, request, body);
  }
  @UseGuards(AuthGuard)
  @Post('/download')
  async download(
    @Res() res: Response,
    @Req() request: Request,
    @Body() body,
  ) {
    return await this.service.download(res, request, body);
  }

  // @UseGuards(RootGuard)
  @UseGuards(AuthGuard)
  @Get('/check-file')
  async checkFileExistFolder(@Res() res: Response, @Req() request: Request) {
    return await this.service.checkFileExistFolder(request, res);
  }
}
