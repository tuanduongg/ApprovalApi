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
import { ProcessQC } from 'src/database/entity/process_qc.entity';
import { ReportQC } from 'src/database/entity/report_qc.entity';
import { FileReportQC } from 'src/database/entity/file_reportQC.entity';
import { ProcessQCModule } from './modules/process_qc/process_qc.module';
import { ReportQCModule } from './modules/report_qc/report_qc.module';
import { FileReportQCModule } from './modules/file_reportQC/file_reportQC.module';
import { JIGModule } from './modules/jig/jig.module';
import { JIG } from 'src/database/entity/jig.entity';
import { InOutJIG } from 'src/database/entity/inout_jig.entity';
import { InOutJIGModule } from './modules/intout_jig/inout_jig.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
            encrypt: false,
          }, //for mssql
          entities: [
            User,
            Role,
            CategoryConcept,
            Concept,
            HistoryConcept,
            FileConcept,
            ProcessQC,
            ReportQC,
            FileReportQC,
            JIG,
            InOutJIG,
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
        console.log(
          `Connected to the database:${connection.options.database}:${connectionOptions.username}-${connectionOptions.host}:${connectionOptions.port}`,
        );
        return connectionOptions;
      },
    } as TypeOrmModuleAsyncOptions),
    AuthModule,
    UsersModule,
    CategoryConceptModule,
    RoleModule,
    ConceptModule,
    ProcessQCModule,
    ReportQCModule,
    FileReportQCModule,
    JIGModule,
    InOutJIGModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
