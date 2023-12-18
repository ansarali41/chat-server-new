import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { Request, Response } from 'express';
import { AppModule } from './app.module';
import { AUTHORIZATION } from './lib/constant';

async function bootstrap() {
  const PORT = Number(process.env.SOCKET_PORT) || 'Null';

  const app = await NestFactory.create(AppModule);
  app.use((req: Request, res: Response, next) => {
    if (req.path === '/') {
      res.send('Chat server. Socket running on port ' + PORT);
      return;
    }
    next();
  });

  const config = new DocumentBuilder()
    .setTitle('Chat Microservice')
    .setDescription('Chat Microservice document')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'apiKey', in: 'header', name: 'Authorization' },
      AUTHORIZATION,
    )
    .addServer('https://chatserver.amharctech.com/api', 'HTTPS')
    .addServer('http://localhost:3044/api', 'HTTP')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3010',
      'http://localhost:4000',
      'http://localhost:3006',
      'http://localhost:5000',
      'http://localhost:5001',
      'https://pos.amharctech.com',
      'https://ecompos.amharctech.com',
      'https://serviceadmin.amharctech.com',
    ],
    credentials: true,
  });
  await app.listen(3044);
  // await app.listen(PORT);
}
bootstrap();
