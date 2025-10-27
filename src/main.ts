import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'node:path';
import { ValidationPipe, HttpException, HttpStatus } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import helmet from 'helmet';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger:
      process.env.NODE_ENV === 'production'
        ? ['error', 'warn']
        : ['log', 'debug', 'error', 'warn'],
  });

  app.disable('x-powered-by'); // ya lo tenías

  app.use(
    helmet({
      xContentTypeOptions: true, // X-Content-Type-Options: nosniff
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // necesario para Swagger UI
          styleSrc: ["'self'", "'unsafe-inline'"], // inline styles permitidos
          imgSrc: ["'self'", "data:", "http://localhost:3000"],
          connectSrc: ["'self'", "ws://localhost:3000"], // si Next.js usa websocket o hot reload
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
          frameAncestors: ["'none'"],
          upgradeInsecureRequests: [],
        },
      },
      frameguard: { action: 'deny' }, // X-Frame-Options: DENY
    }),
  );

  app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  });

  // Habilitar CORS
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Servir archivos estáticos
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/public/',
  });

  // Validaciones globales
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const formattedErrors = errors.map((err) => ({
          field: err.property,
          errors: err.constraints ? Object.values(err.constraints) : [],
        }));
        return new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Datos inválidos en la solicitud',
            errors: formattedErrors,
          },
          HttpStatus.BAD_REQUEST,
        );
      },
    }),
  );


  // Manejo global de errores
  app.useGlobalFilters(new AllExceptionsFilter());

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('onFraud Documentation')
    .setDescription('Documentación del API Rest onFraud en Swagger')
    .setVersion('2.0')
    .addBearerAuth()
    .build();
  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs-onfraud', app, doc);

  const port = Number(process.env.PORT);
  if (!port) {
    throw new Error("PORT no está definido en variables de entorno");
  }

  await app.listen(port);
  console.log(`🚀 onFraud API running on http://localhost:${port}`);
}

bootstrap();