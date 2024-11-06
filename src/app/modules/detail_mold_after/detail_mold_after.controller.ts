import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { DetailMoldAfterService } from './detail_mold_after.service';
// import { IsVNGuard } from 'src/core/guards/isVN.guard';

@Controller('detail-mold-after')
export class DetailMoldAfterController {
  constructor(private service: DetailMoldAfterService) {}

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
