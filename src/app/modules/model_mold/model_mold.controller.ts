import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ModelMoldService } from './model_mold.service';
import { AuthGuard } from '../auth/auth.guard';
import { RBACGuard } from 'src/core/guards/RBAC.guard';

@Controller('model-mold')
export class ModelMoldController {
  constructor(private service: ModelMoldService) { }

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
  @Post('/findByCategory')
  async findByCategory(@Res() res: Response, @Req() request: Request, @Body() body) {
    return await this.service.findByCategory(body, request, res);
  }

  @UseGuards(RBACGuard)
  @UseGuards(AuthGuard)
  @Post('/exportExcel')
  async exportExcel(@Res() res: Response, @Req() request: Request, @Body() body) {
    return await this.service.exportExcel(body, request, res);
  }


  @UseGuards(RBACGuard)
  @UseGuards(AuthGuard)
  @Post('/update')
  async update(@Res() res: Response, @Req() request: Request, @Body() body) {
    return await this.service.update(body, request, res);
  }
}
