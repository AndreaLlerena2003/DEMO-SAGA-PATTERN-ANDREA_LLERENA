import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateSpaReservationDto } from 'src/usecases/create-reservation/dtos/create-reservation-dto';
import { AppointmentServiceInterface } from './appointment.service.interface';
import { AppointmentRepository } from 'src/repositories/appointment.repository';
import { Appointment } from 'src/entities/appointment.schema';
import { AppointmentStatus } from 'src/entities/reservation-status';
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAppointmentSaga } from 'src/usecases/create-reservation/saga/create-appointment-saga';
@Injectable()
export class AppointmentService implements AppointmentServiceInterface {
  private readonly logger = new Logger(AppointmentService.name);

  constructor(
    @Inject(AppointmentRepository)
    private readonly appointmentRepository: AppointmentRepository,
    @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
    private saga: CreateAppointmentSaga
  ) {}

  async createAppointment(appointmentRequest: CreateSpaReservationDto): Promise<void> {
    this.logger.log('Creating appointment...');
    try {
      this.logger.log('Appointment data:', JSON.stringify(appointmentRequest, null, 2));
      const appointment = new this.appointmentModel({
        appointmentId: uuidv4(),
        customerId: appointmentRequest.customerId,
        status: AppointmentStatus.PENDING,
        appointmentDate: appointmentRequest.reservationDate,
        appointmentHour: appointmentRequest.reservationTime,
        service: {
          serviceId: appointmentRequest.spaService.serviceId,
          price: appointmentRequest.spaService.totalPrice,
        },
        totalPrice: appointmentRequest.spaService.totalPrice,
      });
      this.saga.execute(appointment);
      this.logger.log('Appointment created successfully');
    } catch (error) {
      this.logger.error('Error creating appointment', error);
      throw new Error('Unable to create appointment. Please try again later.');
    }
  }
  


}
