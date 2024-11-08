import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ListAPIService } from 'src/app/modules/list_api/list_api.service';
import { PermissionService } from 'src/app/modules/permission/permission.service';
import { UsersService } from 'src/app/modules/users/users.service';
import { clearPrefixApi } from '../utils/helper';

@Injectable()
export class RBACGuard implements CanActivate {
  constructor(
    @Inject(UsersService) private readonly userService: UsersService,
    @Inject(PermissionService) private readonly permissionService: PermissionService,
    @Inject(ListAPIService) private readonly listApiService: ListAPIService
  ) { }
  // những tài khoản root ms được vào màn user,
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const screen = request.headers['screen']?.trim();
    let url = request.url;
    if (url) {
      url = clearPrefixApi(url);
    }
    if (!screen) {
      throw new HttpException('Forbidden', HttpStatus.BAD_REQUEST);
    }
    if (request?.user?.userName) {
      const roleID = await this.userService.getRoleID(request?.user?.userName);
      const permissionFindPromiss = this.permissionService.findOneByRole(roleID, screen);
      const checkApiPromiss = this.listApiService.findOne(screen, url);
      const [permissionFind, checkApi] = await Promise.all([permissionFindPromiss, checkApiPromiss]);
      if (permissionFind && checkApi && permissionFind[checkApi?.apiType]) {
        return true;
      } else {
        throw new HttpException('Forbidden', HttpStatus.BAD_REQUEST);
      }
    } else {
      throw new HttpException('Forbidden', HttpStatus.BAD_REQUEST);
    }


  }
}