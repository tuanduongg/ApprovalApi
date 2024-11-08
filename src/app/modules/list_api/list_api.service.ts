import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ListAPI } from 'src/database/entity/list_api.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ListAPIService {
  constructor(
    @InjectRepository(ListAPI)
    private repository: Repository<ListAPI>,
  ) { }

  async all() {
    return await this.repository.find();
  }

  async findOne(screen: string, url: string) {
    if (screen && url) {
      const find = await this.repository.findOne({ where: { apiScreen: screen, apiUrl: url } });
      return find;
    }
    return null;
  }

}
