import {  Injectable, OnModuleInit } from '@nestjs/common';
import { Step } from './steps';
import { Appointment } from 'src/entities/appointment.schema';
import { AppointmentRepository } from 'src/repositories/appointment.repository';

@Injectable()
export class PlaceAppointmentStep extends Step<Appointment, void> implements OnModuleInit{
    constructor(
        private appointmentRepository: AppointmentRepository,
      ) {
        super();
        this.name = 'place-appointment-step';
      }

    async invoke(appointment: Appointment): Promise<void> {
        await this.appointmentRepository.create(appointment);
        console.info('Appointment inserted successfully');
        return Promise.resolve();
    }
    
    async withCompenstation(appointment: Appointment): Promise<void> {
        console.info(`Rollback: Removing appointment with ID: ${appointment.appointmentId}`);
        await this.appointmentRepository.deleteOne({ appointmentId: appointment.appointmentId });
        console.info('Appointment removed successfully as part of rollback');
        return Promise.resolve();
    }

    async onModuleInit() {
      console.log('Connecting...');
    }

      
}