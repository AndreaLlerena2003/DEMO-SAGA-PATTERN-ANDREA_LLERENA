import { CreateSpaReservationDto } from '../usecases/create-reservation/dtos/create-reservation-dto'
import { Appointment } from 'src/entities/appointment.schema';
export interface AppointmentServiceInterface {
  createAppointment(body: CreateSpaReservationDto): Promise<void>;
}