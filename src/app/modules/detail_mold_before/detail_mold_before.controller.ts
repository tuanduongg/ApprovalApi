import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { DetailMoldBeforeService } from './detail_mold_before.service';
import { RBACGuard } from 'src/core/guards/RBAC.guard';

@Controller('detail-mold-before')
export class DetailMoldBeforeController {
  constructor(private service: DetailMoldBeforeService) { }

  @UseGuards(RBACGuard)
  @UseGuards(AuthGuard)
  @Post('/all')
  async all(@Res() res: Response, @Req() request: Request, @Body() body) {
    return await this.service.all(body, request, res);
  }

  @UseGuards(RBACGuard)
  @UseGuards(AuthGuard)
  @Post('/add')
  async add(@Res() res: Response, @Req() request: Request, @Body() body) {
    return await this.service.add(body, request, res);
  }

  @UseGuards(RBACGuard)
  @UseGuards(AuthGuard)
  @Post('/update')
  async update(@Res() res: Response, @Req() request: Request, @Body() body) {
    return await this.service.update(body, request, res);
  }

  @UseGuards(RBACGuard)
  @UseGuards(AuthGuard)
  @Post('/delete')
  async delete(@Res() res: Response, @Req() request: Request, @Body() body) {
    return await this.service.delete(body, request, res);
  }
}
