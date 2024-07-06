import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entity/user.entity';
import { UserController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers:[UserController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
