import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PaymentRepository } from 'src/repositories/payment.repository';
import { Payment } from 'src/entities/payment.schema';
import { PaymentServiceInterface } from './payment.service.interface';
import { PaymentStatus } from 'src/entities/payment-status';

@Injectable()
export class PaymentService implements PaymentServiceInterface {
    private readonly logger = new Logger(PaymentService.name);
    
    constructor(private readonly paymentRepository: PaymentRepository) {}

    async authorize(request: { appointmentId: string; }): Promise<void> {
        this.logger.log(`Attempting to authorize payment for appointment ID: ${request.appointmentId}`);
        
        const filterQuery = { appointmentId: request.appointmentId };
        const update = { status: PaymentStatus.AUTHORIZED }; 
        const updatedPayment = await this.paymentRepository.findOneAndUpdate(filterQuery, update);
        
        if (!updatedPayment) {
            this.logger.error(`Payment not found for appointment ID: ${request.appointmentId}`);
            throw new NotFoundException('Payment not found for the given appointment ID.');
        }

        this.logger.log(`Payment authorized successfully for appointment ID: ${request.appointmentId}`);
    }

    async cancel(request: { appointmentId: string; }): Promise<void> {
        this.logger.log(`Attempting to cancel payment for appointment ID: ${request.appointmentId}`);
        
        const filterQuery = { appointmentId: request.appointmentId };
        const update = { status: PaymentStatus.CANCELED }; 
        const updatedPayment = await this.paymentRepository.findOneAndUpdate(filterQuery, update);
        
        if (!updatedPayment) {
            this.logger.error(`Payment not found for appointment ID: ${request.appointmentId}`);
            throw new NotFoundException('Payment not found for the given appointment ID.');
        }

        this.logger.log(`Payment canceled successfully for appointment ID: ${request.appointmentId}`);
    }

    async authorizePayment(request: { appointmentId: string; amount: number; }): Promise<{ authorized: boolean; }> {
        this.logger.log(`Creating payment for appointment ID: ${request.appointmentId} with amount: ${request.amount}`);
        
        const dataForPayment: Payment = {
            appointmentId: request.appointmentId,
            amount: request.amount,
            paymentDate: new Date(),
            status: PaymentStatus.PENDING
        };

        await this.paymentRepository.create(dataForPayment);
        this.logger.log(`Payment created for appointment ID: ${request.appointmentId}`);
        
        await this.authorize({ appointmentId: request.appointmentId });
        
        return { authorized: true };
    }

    async refund(request: { appointmentId: string; amount: number; }): Promise<void> {
        this.logger.log(`Processing refund for appointment ID: ${request.appointmentId} with amount: ${request.amount}`);
        
        await this.cancel({ appointmentId: request.appointmentId });
        this.logger.log(`Refund processed successfully for appointment ID: ${request.appointmentId}`);
    }
}
