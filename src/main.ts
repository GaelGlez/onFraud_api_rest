import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Habilitar CORS
  app.enableCors({
    origin: 'http://localhost:3000', // o '*' para permitir todos los orígenes
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // si envías cookies
  });
  app.useStaticAssets(
    join(__dirname, "..", "public"),{
      prefix: "/public/"
    }
  );
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,       // elimina propiedades que no están en el DTO
    forbidNonWhitelisted: true, // lanza error si llegan propiedades extras
    transform: true,       // transforma tipos automáticamente (string -> number, etc.)
  }));
  const config = new DocumentBuilder()
    .setTitle('onFraud Documentation') // Título del API
    .setDescription('Documentación del API Rest onFraud en Swagger') // Descripción del API
    .setVersion('2.0')// Versión del API
    .addBearerAuth()
    .build();
  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs-onfraud', app, doc); // <-- Aquí defines la ruta de Swagger
  await app.listen(process.env.PORT ?? 4000);
  //await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
function addBearerAuth() {
  throw new Error('Function not implemented.');
}

