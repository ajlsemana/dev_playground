import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  //ajl::for Swagger API documentation
  const config = new DocumentBuilder()
    .setTitle('Collections Case API')
    .setDescription('API endpoints for cases, actions, assignment engine, and notice PDF via Puppeteer')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  //ajl::end Swagger setup

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
