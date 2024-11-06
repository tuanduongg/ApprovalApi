import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { comparePasswords, dirSize, getAllFilesInFolder, hashPassword } from 'src/core/utils/helper';
import { Role } from 'src/database/entity/role.entity';
import { User } from 'src/database/entity/user.entity';
import { ILike, Like, Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

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
      relations: ['role'],
    });
    return user;
  }
  async profile() {
    return true;
  }
  async create(body, request, res) {
    const { fullName, userName, role, password, isRoot, isKorean,department } = body;
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
      user.department = department;
      user.isRoot = isRoot ?? false;
      user.isKorean = isKorean ?? false;
      user.role = new Role().roleId = role;
      await this.repository.save(user);

      return res.status(HttpStatus.OK).send(user);
    }
  }
  async update(body, request, res) {
    const { fullName, role, isRoot, userId, isKorean ,department} = body;
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
    userFind.department = department;
    userFind.isRoot = isRoot ?? false;
    userFind.isKorean = isKorean ?? false;
    if (role) {
      userFind.role = new Role().roleId = role;
    }
    await this.repository.save(userFind);
    return res.status(HttpStatus.OK).send(userFind);
  }
  async public() {
    return await this.repository.find({
      where: {
        role: { create: true },
      },
      select: {
        fullName: true,
        department: true,
        userId: true,
        userName: true,
        role: {
          roleName: true,
        },
      },
      relations: ['role'],
    });
  }
  async all(request, body, res) {
    const search = body?.search;
    const data = await this.repository.find({
      where: [
        {
          userName: Like(`%${search}%`),
        },
        {
          fullName: Like(`%${search}%`),
        },
      ],
      select: {
        fullName: true,
        userId: true,
        userName: true,
        department: true,
        role: {
          roleName: true,
        },
        isRoot: true,
        isKorean: true,
      },
      relations: ['role'],
    });
    return res?.status(200).send(data);
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
    const size = await dirSize(process.env.UPLOAD_FOLDER || './public');
    return res.status(HttpStatus.OK).send({ size });
  }


  
}
