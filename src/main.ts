import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
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
  const config = new DocumentBuilder().setTitle('API Documentation') // Título del API
    .setDescription('Ejemplo documentación de un REST API en Swagger') // Descripción del API
    .setVersion('1.0').build(); // Versión del API
  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, doc); // <-- Aquí defines la ruta de Swagger
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
