import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Step } from './steps';
import { Appointment } from 'src/entities/appointment.schema';
import { AppointmentRepository } from 'src/repositories/appointment.repository';

@Injectable()
export class ConfirmAppointmentStep extends Step<Appointment, void> implements OnModuleInit{
    constructor(
    
        private appointmentService: AppointmentRepository
    ){
        super();
        this.name = 'confirm-appointment-step';
    }

    async invoke(appointment: Appointment): Promise<void> {
        await this.appointmentService.confirm(appointment.appointmentId);
        return Promise.resolve();
    }
    async withCompenstation(appointment: Appointment): Promise<void> {
        await this.appointmentService.cancel(appointment.appointmentId);
        return Promise.resolve();
    }

    async onModuleInit() {
        console.log('Connecting confirm...');
      }
  

    
}