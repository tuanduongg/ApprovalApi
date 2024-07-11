import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/database/entity/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {

    constructor(
        @InjectRepository(Role)
        private repository: Repository<Role>,
    ) { }

    async all() {
        return await this.repository.find();
    }
}
