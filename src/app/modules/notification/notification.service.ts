import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from 'src/database/entity/notification.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationService {

    constructor(
        @InjectRepository(Notification)
        private repository: Repository<Notification>,
    ) { }

    async all() {
        return await this.repository.find({ where: { isShow: true } });
    }
}
