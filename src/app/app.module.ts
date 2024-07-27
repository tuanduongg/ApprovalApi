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
import { Role } from 'src/database/entity/role.entity';
import { CategoryConcept } from 'src/database/entity/category_concept.entity';
import { Concept } from 'src/database/entity/concept.entity';
import { HistoryConcept } from 'src/database/entity/history_concept.entity';
import { FileConcept } from 'src/database/entity/file_concept.entity';
import { CategoryConceptModule } from './modules/category_concept/category_concept.module';
import { RoleModule } from './modules/role/role.module';
import { ConceptModule } from './modules/concept/concept.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
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
          options: {
            trustServerCertificate: true,
            enableArithAbort: true,
          }, //for mssql
          entities: [
            User,
            Role,
            CategoryConcept,
            Concept,
            HistoryConcept,
            FileConcept,
          ],
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
        console.log(`Connected to the database:${connection.options.database}:${connectionOptions.username}-${connectionOptions.host}:${connectionOptions.port}`);
        return connectionOptions;
      },
    } as TypeOrmModuleAsyncOptions),
    AuthModule,
    UsersModule,
    CategoryConceptModule,
    RoleModule,
    ConceptModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
