import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { UsersService } from 'src/app/modules/users/users.service';

@Injectable()
export class IsVNGuard implements CanActivate {
  constructor(@Inject(UsersService) private readonly userService: UsersService) { }
  // những tài khoản root ms được vào màn user,
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (request?.user?.userName) {
      const user = await this.userService.findOne(request?.user?.userName);
      if (!user?.isKorean) {
        return true;
      }
      throw new ForbiddenException();
    }

    throw new ForbiddenException();
  }
}