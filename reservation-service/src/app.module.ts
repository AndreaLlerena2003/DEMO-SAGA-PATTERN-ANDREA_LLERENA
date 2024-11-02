import { Module, Logger } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppointmentSchema, Appointment } from './entities/appointment.schema';
import { AppointmentRepository } from './repositories/appointment.repository';
import { CreateAppointmentController } from './usecases/create-reservation/create-appointmnet.controller';
import { AppointmentService } from './services/appointment.service';
import { AuthorizePaymentStep } from './usecases/create-reservation/saga/steps/authorize-payment.step';
import { CheckAvailibityStep } from './usecases/create-reservation/saga/steps/check-product-availibilty.step';
import { ConfirmAppointmentStep } from './usecases/create-reservation/saga/steps/confirm-appointment.step';
import { PlaceAppointmentStep } from './usecases/create-reservation/saga/steps/place-appoitment.step';
import { UpdateAvailibilityStep } from './usecases/create-reservation/saga/steps/update-availibility.step';
import { CreateAppointmentSaga } from './usecases/create-reservation/saga/create-appointment-saga';
import { ClientsModule, Transport } from '@nestjs/microservices';
import config from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGO_URI');
        Logger.log('Connecting to MongoDB at: ' + uri, 'AppModule');
        return { uri };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: Appointment.name, schema: AppointmentSchema }]),
    ClientsModule.register([
      {
        name: 'availability-client',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'reservation',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'availability',
            allowAutoTopicCreation: true,
          },
        },
      },
      {
        name: 'payment-client',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'reservation',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'payment',
            allowAutoTopicCreation: true,
          },
        },
      },
    ]),
  ],
  providers: [
    AppService,
    AppointmentRepository,
    PlaceAppointmentStep ,
    CheckAvailibityStep,
    AuthorizePaymentStep,
    UpdateAvailibilityStep,
    ConfirmAppointmentStep,
    CreateAppointmentSaga,
    { provide: 'appointment-service', useClass: AppointmentService },
  ],
  controllers: [AppController, CreateAppointmentController],
})
export class AppModule {}
