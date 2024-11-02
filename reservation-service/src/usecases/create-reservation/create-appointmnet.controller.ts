import {
    Body,
    Controller,
    GoneException,
    Inject,
    InternalServerErrorException,
    Post,
    HttpCode,
    HttpStatus,
    Logger,
} from '@nestjs/common';

import { CreateSpaReservationDto } from './dtos/create-reservation-dto';
import { OutOfAvailabilityError } from 'src/exceptions/out_of_availability_error';
import { PaymentNotSuccessfulError } from 'src/exceptions/payment_not_successful';
import { PaymentRequiredException } from 'src/exceptions/http/payment_required_exception';
import { AppointmentServiceInterface } from 'src/services/appointment.service.interface';

@Controller('appointments')
export class CreateAppointmentController {
    private readonly logger = new Logger(CreateAppointmentController.name); // Inicializa el logger

    constructor(
        @Inject('appointment-service')
        private readonly service: AppointmentServiceInterface
    ) {}

    @Post('/create-appointment')
    @HttpCode(HttpStatus.CREATED) 
    async createReservation(@Body() body: CreateSpaReservationDto) {
        this.logger.log(`Received request to create appointment with body: ${JSON.stringify(body)}`); // Log de la solicitud

        try {
            await this.service.createAppointment(body);
            this.logger.log('Appointment created successfully'); // Log de éxito
            return { message: 'Appointment created successfully' }; 
        } catch (error) {
            this.logger.error('Error creating appointment', error.stack); // Log de error completo
            if (error instanceof OutOfAvailabilityError) {
                throw new GoneException({ message: error.message });
            }
            if (error instanceof PaymentNotSuccessfulError) {
                throw new PaymentRequiredException({ message: error.message });
            }
            throw new InternalServerErrorException({ message: error.message });
        }
    }
}
