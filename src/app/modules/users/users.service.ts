import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { comparePasswords, hashPassword } from 'src/core/utils/helper';
import { Role } from 'src/database/entity/role.entity';
import { User } from 'src/database/entity/user.entity';
import { ILike, Repository } from 'typeorm';
import * as path from 'path';
import { readdir, stat } from 'fs/promises';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) { }

  async findOne(username: string): Promise<User> {
    const user = await this.repository.findOne({
      where: {
        userName: username,
      },
      relations: ['role']
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
    const { fullName, role, isRoot, userId } = body;
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
  async public() {
    return await this.repository.find({
      where: {
        role: { create: true }
      },
      select: {
        fullName: true,
        userId: true,
        userName: true,
        role: {
          roleName: true,
        },
      },
      relations: ['role'],
    });
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
  async checkRole(body, request, res) {
    const user = await this.repository.findOne({
      where: { userName: request?.user?.userName },
      relations: ['role'],
    });

    if (user) {
      return res.status(HttpStatus.OK).send(user?.role);
    }
    return res.status(HttpStatus.BAD_REQUEST).send({ message: 'Not found!' });
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
  async changePassword(body, request, res) {
    const username = request?.user?.userName;
    const { currentPassword, newPassword, confirmPassword } = body;
    if (newPassword !== confirmPassword) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: 'New password must be equal Confirm password!' });
    }
    if (!username) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: 'userId not found!' });
    }
    const userFind = await this.findOne(username);
    if (userFind) {
      const checkPassword = await comparePasswords(
        currentPassword,
        userFind?.password,
      );
      if (checkPassword) {
        const hashPass = await hashPassword(newPassword);
        userFind.password = hashPass;
        await this.repository.save(userFind);
        delete userFind.password;
        return res.status(HttpStatus.OK).send(userFind);
      }
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: 'Current password wrong!' });
    } else {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: 'User not found!' });
    }
  }
  async fake() {
    const hashPasswordString = await hashPassword('1234');
    return await this.repository.save({
      fullName: 'Dương Ngô Tuấn',
      userName: 'TUANIT',
      password: hashPasswordString,
    });
  }
  async getStorage(res) {
    const size = await this.dirSize('./public');
    return res.status(HttpStatus.OK).send({ size })
  }
  async dirSize(dir) {
    const files = await readdir(dir, { withFileTypes: true });

    const paths = files.map(async file => {
      const pathFile = path.join(dir, file.name);

      if (file.isDirectory()) return await this.dirSize(pathFile);

      if (file.isFile()) {
        const { size } = await stat(pathFile);

        return size;
      }

      return 0;
    });

    return (await Promise.all(paths)).flat(Infinity).reduce((i, size) => i + size, 0);
  }
}
