import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConnectionOptions, createConnection } from 'typeorm';
import { UsersModule } from './modules/users/users.module';
import { ConfigDB } from 'src/database/configDB';
import { User } from 'src/database/entity/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: async (): Promise<ConnectionOptions> => {
        const connectionOptions: ConnectionOptions = {
          type: 'mssql',
          host: ConfigDB?.host,
          port: ConfigDB?.port,
          username: ConfigDB?.username,
          password: ConfigDB?.password,
          database: ConfigDB?.database,
          options: { trustServerCertificate: true }, //for mssql
          entities: [User],
          requestTimeout: 30000, //for mssql
          synchronize: true,
          pool: {
            //for mssql
            max: 10,
            min: 0,
            idleTimeoutMillis: 30000,
          },
        };
        const connection = await createConnection(connectionOptions);
        console.log('Connected to the database', connection.options.database);
        return connectionOptions;
      },
    } as TypeOrmModuleAsyncOptions),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
