import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private service: NotificationService) { }

  @UseGuards(AuthGuard)
  @Get('/all')
  async all() {
    return await this.service.all();
  }

}
