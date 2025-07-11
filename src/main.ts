import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { validationOptions } from './config/validation';
import { serializationOptions } from './config/serialization';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig, swaggerTheme } from './config/swagger';
import { ENV } from './config/env';

async function bootstrap() {
  // create app
  const app = await NestFactory.create(AppModule);
  app.getHttpAdapter().getInstance().disable('x-powered-by');
  app.setGlobalPrefix('/api');
  app.enableShutdownHooks();

  // middlewares
  app.enableCors({ origin: '*' });
  // enable validation & serialization
  app.useGlobalPipes(
    new ValidationPipe(validationOptions), // validate incoming data
  );
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), serializationOptions), // serialize outgoing data
  );

  // swagger
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document, { customCss: swaggerTheme });

  // start app
  await app.listen(ENV.PORT);
  console.info(`Application is running on ${await app.getUrl()}`);
}
bootstrap();
