import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hashPassword } from 'src/core/utils/helper';
import { Role } from 'src/database/entity/role.entity';
import { User } from 'src/database/entity/user.entity';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  async findOne(username: string) {
    const user = await this.repository.findOne({
      where: { userName: username },
    });
    return user;
  }
  async profile() {
    return true;
  }
  async create(body, request, res) {
    const { fullName, userName, role, password, isRoot } = body;
    const userFind = await this.repository.findOne({
      where: { userName: ILike(userName) },
    });
    if (userFind) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: 'Username existed!' });
    } else {
      const hashPass = await hashPassword(password);
      const user = new User();
      user.fullName = fullName;
      user.userName = userName;
      user.password = hashPass;
      user.isRoot = isRoot ?? false;
      user.role = new Role().roleId = role;
      await this.repository.save(user);

      return res.status(HttpStatus.OK).send(user);
    }
  }
  async update(body, request, res) {
    const { fullName,  role, isRoot, userId } = body;
    if (!userId) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: 'userId not found!' });
    }
    const userFind = await this.repository.findOne({
      where: { userId: userId },
    });
    if (body?.password) {
      const hashPass = await hashPassword(body?.password);
      userFind.password = hashPass;
    }
    userFind.fullName = fullName;
    userFind.isRoot = isRoot ?? false;
    if (role) {
      userFind.role = new Role().roleId = role;
    }
    await this.repository.save(userFind);
    return res.status(HttpStatus.OK).send(userFind);
  }
  async all() {
    return await this.repository.find({
      select: {
        fullName: true,
        userId: true,
        userName: true,
        role: {
          roleName: true,
        },
        isRoot: true,
      },
      relations: ['role'],
    });
  }
  async find(body, request, res) {
    if (!body?.userId) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: 'userId not found!' });
    }

    const userFind = await this.repository.findOne({
      where: { userId: body?.userId },
      relations: ['role'],
    });
    userFind.password = '';
    return res.status(HttpStatus.OK).send(userFind);
  }
  async fake() {
    const hashPasswordString = await hashPassword('1234');
    return await this.repository.save({
      fullName: 'Dương Ngô Tuấn',
      userName: 'TUANIT',
      password: hashPasswordString,
    });
  }
}
