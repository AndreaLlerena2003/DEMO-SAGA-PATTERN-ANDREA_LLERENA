// appointment.repository.ts
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Appointment } from '../entities/appointment.schema';

import { Injectable , Logger} from '@nestjs/common';
import { AbstractRepository } from './abstract.repository';
import { AppointmentStatus } from 'src/entities/reservation-status';

@Injectable()
export class AppointmentRepository extends AbstractRepository<Appointment> {
  protected readonly logger = new Logger(AppointmentRepository.name);
  constructor(
    @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
    @InjectConnection() connection: Connection,
  ) {
    super(appointmentModel,connection);
  }

  async cancel(appointmentId: string): Promise<void> {
    this.logger.log(`Cancelling appointment with ID: ${appointmentId}`);
    try {
      const updateResult = await this.findOneAndUpdate(
        { appointmentId: appointmentId },
        { $set: { status: AppointmentStatus.CANCELED } }
      );
  
      if (!updateResult) {
        this.logger.error(`Appointment with ID: ${appointmentId} not found.`);
        throw new Error('Appointment not found.');
      }
  
      this.logger.log('Appointment cancelled successfully');
    } catch (error) {
      this.logger.error('Error cancelling appointment', error);
      throw new Error('Unable to cancel appointment. Please try again later.');
    }
  }

  async confirm(appointmentId: string): Promise<void> {
    this.logger.log(`Confirm appointment with ID: ${appointmentId}`);
    try {
      const updateResult = await this.findOneAndUpdate(
        { appointmentId: appointmentId },
        { $set: { status: AppointmentStatus.CONFIRMED } }
      );
  
      if (!updateResult) {
        this.logger.error(`Appointment with ID: ${appointmentId} not found.`);
        throw new Error('Appointment not found.');
      }
  
      this.logger.log('Appointment confirm successfully');
    } catch (error) {
      this.logger.error('Error confirm appointment', error);
      throw new Error('Unable to confirm appointment. Please try again later.');
    }
  }

  async complete(appointmentId: string): Promise<void> {
    this.logger.log(`Complete appointment with ID: ${appointmentId}`);
    try {
      const updateResult = await this.findOneAndUpdate(
        { appointmentId: appointmentId },
        { $set: { status: AppointmentStatus.COMPLETED } }
      );
  
      if (!updateResult) {
        this.logger.error(`Appointment with ID: ${appointmentId} not found.`);
        throw new Error('Appointment not found.');
      }
  
      this.logger.log('Appointment completed successfully');
    } catch (error) {
      this.logger.error('Error completed appointment', error);
      throw new Error('Unable to completed appointment. Please try again later.');
    }
  }

}
