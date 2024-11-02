import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AvailabilitySchema, Availability } from './entities/availability.schema';
import { AvailabilityRepository } from './repositories/availability.repository';
import { AvailabilityService } from './services/availability.service';
import { CheckAvailabilityController } from './usecases/fetch-availible-dates/check-availability-dates.controller';
import { UpdateAvailabilityController } from './usecases/update-availability/update-availability.controller';

import config from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config], 
      envFilePath: '.env', 
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'), 
      }),
    }),
    MongooseModule.forFeature([{ name: Availability.name, schema: AvailabilitySchema }]),
  ],
  controllers: [AppController, CheckAvailabilityController, UpdateAvailabilityController],
  providers: [AppService, AvailabilityRepository, {
    provide: 'availability-service',
    useClass: AvailabilityService, 
  }],
})
export class AppModule {}
 