import { Body, Controller, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
@Controller('auth')
export class AuthController {
    constructor(private readonly service: AuthService) {

    }

    @Post('/login')
    async login(@Res() res: Response, @Req() request: Request, @Body() body) {
        const username = body?.username;
        const password = body?.password;
        const data = await this.service.signIn(username, password);
        if (data) {
            return res.status(HttpStatus.OK).send({ message: 'Logged in successfully',data });
        } else if (data === null) { //username not found
            return res.status(HttpStatus.UNAUTHORIZED).send({ message: 'Username not found!' });
        } else { //password faild
            return res.status(HttpStatus.UNAUTHORIZED).send({ message: 'Check your password!' });
        }
    }
}
