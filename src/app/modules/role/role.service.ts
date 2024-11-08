import { HttpStatus, Injectable } from '@nestjs/common';
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
    return await this.repository.find({ relations: ['permisstions'] });
  }
  async update(res, body) {
    const data = body?.data;
    const dataObj = JSON.parse(data);
    try {
      await this.repository.save(dataObj);

      return res?.status(HttpStatus.OK).send({ message: 'Successful!' });
    } catch (error) {
      return res
        ?.status(HttpStatus.BAD_REQUEST)
        .send({ message: 'Update fail!' });

    }
    // if (dataObj?.length > 0) {
    //   const dataToSave = dataObj.filter((item) => {
    //     return item?.roleName;
    //   });
    //   return res?.status(HttpStatus.OK).send({ message: 'Successful!' });
    // }
    // return res
    // ?.status(HttpStatus.BAD_REQUEST)
    // .send({ message: 'Update fail!' });
  }
}
