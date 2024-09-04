import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { InOutJIGService } from './inout_jig.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('inout-jig')
export class InOutJIGController {
  constructor(private service: InOutJIGService) {}

  @UseGuards(AuthGuard)
  @Post('/findByJig')
  async findByJig(@Res() res: Response, @Req() request: Request, @Body() body) {
    return await this.service.findByJig(body, request, res);
  }
}
