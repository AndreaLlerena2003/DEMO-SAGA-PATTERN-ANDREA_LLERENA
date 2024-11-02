import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Step } from './steps';
import { Appointment } from 'src/entities/appointment.schema';
import { lastValueFrom } from 'rxjs';
import config from 'src/config';
import { ClientKafka, ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UpdateAvailibilityStep extends Step<Appointment, void> implements OnModuleInit{
    constructor(
      @Inject('availability-client')
        private availibilityClient: ClientKafka,
      ) {
        super();
        this.name = 'update-availability-step';
      }

    async invoke(appointment: Appointment): Promise<void> {
       const updateAvailibility = await lastValueFrom(
          this.availibilityClient.send('availability.slots.reserve',{
            slots: [
              {
                  date: appointment.appointmentDate,
                  timeSlot: appointment.appointmentHour,
                  serviceId: appointment.service.serviceId
              },
            ],
          }),
       );
       if(!updateAvailibility.success){
          throw new Error("Couldn't update availinility");
       }
    }
    
    
    async withCompenstation(appointment: Appointment): Promise<void> {
      const updateAvailibility = await lastValueFrom(
        this.availibilityClient.send('availability.slots.release',{
          slots: [
            {
                date: appointment.appointmentDate,
                timeSlot: appointment.appointmentHour
            },
          ],
        }),
      );
      if(!updateAvailibility.success){
        throw new Error("Couldn't update availinility");
      }
    }

    async onModuleInit() {
      
     // this.availibilityClient.subscribeToResponseOf('availability.slots.reserve');
     // this.availibilityClient.subscribeToResponseOf('availability.slots.release');
      try {
        this.availibilityClient.subscribeToResponseOf('availability.slots.reserve');
        this.availibilityClient.subscribeToResponseOf('availability.slots.release');
        this.availibilityClient.subscribeToResponseOf('availability.slots.reserve.reply');
        this.availibilityClient.subscribeToResponseOf('availability.slots.release.reply');
        await this.availibilityClient.connect();
        
        console.log('Connected to Kafka');
      } catch (error) {
        console.error('Failed to connect to Kafka', error);
      }
    }

   
    
}