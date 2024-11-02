import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClientKafka } from '@nestjs/microservices';
import { MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'], 
  });
  const logger = new Logger('Bootstrap'); 

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Order Service')
    .setDescription('The Appointments API description')
    .setVersion('1.0')
    .addTag('order')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document); 

  await app.listen(3000);
  logger.log('Application is running on: http://localhost:3000'); 
}
bootstrap();
