import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class RootGuard implements CanActivate {
  constructor(private userService: UsersService) {}
// những tài khoản root ms được vào màn user,
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (request?.user?.userName) {
      const user = await this.userService.findOne(request?.user?.userName);      
      if (user?.isRoot) {
        return true;
      }
      throw new ForbiddenException();
    }

    throw new ForbiddenException();
  }
}
