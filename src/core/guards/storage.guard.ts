import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { dirSize } from '../utils/helper';

@Injectable()
export class StorageGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const size = await dirSize(process.env.UPLOAD_FOLDER || './public');
        const maxSize = process.env.MAX_SIZE_UPLOAD || 1099511627776; // 1TB

        if (size >= maxSize) {
            throw new HttpException('Your storage is full!', HttpStatus.BAD_REQUEST);
        }

        return true;
    }
}