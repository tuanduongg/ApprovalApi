import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: true,
    rawBody: true,
  });
  const configService = app.get(ConfigService);
  const folderUpload = 'public';
  app.useStaticAssets(join(__dirname, '..', folderUpload));
  app.enableCors();
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.use(
    compression({
      filter: () => {
        return true;
      },
      threshold: 0,
    }),
  );

  const PORT = configService.get('PORT') || 5005;
  await app.listen(PORT);
  console.log('V.09.08.24');
  console.log('app start at port ' + PORT);
}
bootstrap();
