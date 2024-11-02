import { Module } from '@nestjs/common';
import { AuthorizePaymentStep } from './authorize-payment.step';
import { CheckAvailibityStep } from './check-product-availibilty.step';
import { ConfirmAppointmentStep } from './confirm-appointment.step';
import { PlaceAppointmentStep } from './place-appoitment.step';
import { UpdateAvailibilityStep } from './update-availibility.step';
import { CreateAppointmentSaga } from '../create-appointment-saga';
import { ClientKafka } from '@nestjs/microservices';
import { AppointmentRepository } from 'src/repositories/appointment.repository';
import { AppointmentService } from 'src/services/appointment.service';
@Module({
  providers: [
    {
      provide: 'availability-kafka-client',
      useFactory: () => {
        const kafkaClient = new ClientKafka({
          client: {
            clientId: 'reservation',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'availability',
            allowAutoTopicCreation: true,
          },
        });
        kafkaClient.connect(); 
        kafkaClient.subscribeToResponseOf('availability.slots.check');
        kafkaClient.subscribeToResponseOf('availability.slots.reserve');
        kafkaClient.subscribeToResponseOf('availability.slots.release');
        return kafkaClient;
      },
    },
    {
      provide: 'payment-kafka-client',
      useFactory: () => {
        const kafkaClient = new ClientKafka({
          client: {
            clientId: 'reservation-payment',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'payment',
            allowAutoTopicCreation: true,
          },
        });
        kafkaClient.connect(); 
        kafkaClient.subscribeToResponseOf('payment.payment.authorize');
        kafkaClient.subscribeToResponseOf('payment.payment.refund');
        return kafkaClient;
      },
    },
    { provide: 'place-appointment-step', useClass: PlaceAppointmentStep },
    { provide: 'check-availability-step', useClass: CheckAvailibityStep },
    { provide: 'authorize-payment', useClass: AuthorizePaymentStep },
    { provide: 'update-availability-step', useClass: UpdateAvailibilityStep },
    { provide: 'confirm-appointment-step', useClass: ConfirmAppointmentStep },
    { provide: 'create-appointment-saga', useClass: CreateAppointmentSaga },
    AppointmentRepository,
    { provide: 'appointment-service', useClass: AppointmentService },
  ],
  exports: [
    'availability-kafka-client', 
    'payment-kafka-client',
    'place-appointment-step',
    'check-availability-step',
    'authorize-payment',
    'update-availability-step',
    'confirm-appointment-step',
    'create-appointment-saga',
  ],
})
export class SagaModule {}
