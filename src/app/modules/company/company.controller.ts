import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { CompanyService } from './company.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('company')
export class CompanyController {
  constructor(private service: CompanyService) { }

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
}
