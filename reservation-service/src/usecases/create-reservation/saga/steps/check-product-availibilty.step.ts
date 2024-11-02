import { Step } from './steps';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ClientProxy } from '@nestjs/microservices';
import config from 'src/config';
import { OutOfAvailabilityError } from 'src/exceptions/out_of_availability_error';
import { lastValueFrom } from 'rxjs';
import { Appointment } from 'src/entities/appointment.schema';

@Injectable()
export class CheckAvailibityStep extends Step<Appointment, void> implements OnModuleInit {

    constructor(
        @Inject('availability-client')
        private availabilityClient: ClientKafka,
      ) {
        super();
        this.name = 'check-availability-step';
    }  

    async invoke(appointment: Appointment): Promise<void> {
        const availabilityResults = await lastValueFrom(
          this.availabilityClient.send('availability.slots.check', {
            slots: [
              {
                date: appointment.appointmentDate,
                timeSlot: appointment.appointmentHour,
              },
            ],
          }),
        );
      
        console.log(JSON.stringify(availabilityResults, null, 2));
      
        if (!availabilityResults.slots[0].available) {
          throw new OutOfAvailabilityError(
            `The selected time slot on ${appointment.appointmentDate} at ${appointment.appointmentHour} is unavailable. Please choose a different slot.`,
          );
        }
    }

    withCompenstation(appointment: Appointment): Promise<void> {
        return Promise.resolve();
    }

    async onModuleInit() {
      console.log('PlaceAppointmentStep initialized');
      console.log('Connecting to Kafka...');
   
      try {
      this.availabilityClient.subscribeToResponseOf('availability.slots.check');
      this.availabilityClient.subscribeToResponseOf('availability.slots.check.reply');
       await this.availabilityClient.connect();
        console.log('Connected to Kafka');
      } catch (error) {
        console.error('Failed to connect to Kafka', error);
      }
    }

}