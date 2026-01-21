import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appSetup } from './setup/app.setup';
import cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { CoreConfig } from './core/core.config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.set('trust proxy', true);
  app.use(cookieParser());
  app.enableCors({});

  const coreConfig: CoreConfig = app.get<CoreConfig>(CoreConfig);

  appSetup(app);

  await app.listen(coreConfig.port ?? 3005);
}
bootstrap();
