import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { comparePasswords } from 'src/core/utils/helper';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async signIn(
        username: string,
        pass: string,
    ) {

        const user = await this.usersService.findOne(username);
        if (!user) {
            return null;
        }
        const checkPassword = await comparePasswords(pass, user?.password);
        if (!checkPassword) {
            return undefined;
        }
        delete user.password;
        const payload = user;

        return {
            token: (await this.jwtService.signAsync({ ...payload })),
            user
        };
    }
}
