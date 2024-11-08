import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from 'src/database/entity/permisstion.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private repository: Repository<Permission>,
  ) { }

  async all() {
    return await this.repository.find();
  }

  async findOneByRole(roleID: any, screen: string) {
    if (roleID && screen) {
      const find = await this.repository.findOne({ where: { role: { roleId: roleID }, screen } });
      if (find) {
        return find;
      }
    }
    return null
  }

}
