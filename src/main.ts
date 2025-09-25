import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder().setTitle('API Documentation') // Título del API
    .setDescription('Ejemplo documentación de un REST API en Swagger') // Descripción del API
    .setVersion('1.0').build(); // Versión del API
  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, doc); // <-- Aquí defines la ruta de Swagger
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
