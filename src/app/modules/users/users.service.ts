import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hashPassword } from 'src/core/utils/helper';
import { User } from 'src/database/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private repository: Repository<User>,
    ) { }


    async findOne(username: string) {
        const user = await this.repository.findOne({ where: { userName: username } });
        return user;
    }
    async profile() {
        return true
    }
    async all() {
        return await this.repository.find({
            select:
            {
                fullName:true,
                userId:true,
                userName:true,
                role:{
                    roleName:true
                },
                isRoot:true
            },
            relations:['role']
        });
    }
    async fake() {
        const hashPasswordString = await hashPassword('1234');
        return await this.repository.save({
            fullName: 'Dương Ngô Tuấn',
            userName: 'TUANIT',
            password: hashPasswordString
        })
    }
}
