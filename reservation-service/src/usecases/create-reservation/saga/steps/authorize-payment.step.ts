import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Step } from './steps';
import config from 'src/config';
import { ClientKafka } from '@nestjs/microservices';
import { PaymentNotSuccessfulError } from 'src/exceptions/payment_not_successful';
import { lastValueFrom } from 'rxjs';
import { Appointment } from 'src/entities/appointment.schema';

@Injectable()
export class AuthorizePaymentStep extends Step<Appointment, void> implements OnModuleInit {

    constructor(
        @Inject('payment-client') private paymentClient: ClientKafka,
    ) {
        super();
        this.name = 'authorize-payment-step';
    }

    async invoke(appointment: Appointment): Promise<void> {
        try {
            const paymentAuthorization = await lastValueFrom(
                this.paymentClient.send('payment.payment.authorize', {
                    appointmentId: appointment.appointmentId,
                    amount: appointment.totalPrice,
                }),
            );
            if (!paymentAuthorization.authorized) {
                throw new PaymentNotSuccessfulError('The payment was unsuccessful');
            }
        } catch (error) {
            console.error('Error during payment authorization:', error);
            throw error; // Rethrow if you want to propagate the error
        }
    }

    async withCompenstation(appointment: Appointment): Promise<void> {
        try {
            await lastValueFrom(
                this.paymentClient.send('payment.payment.refund', {
                    appointmentId: appointment.appointmentId,
                    amount: appointment.totalPrice,
                }),
            );
        } catch (error) {
            console.error('Error during refund process:', error);
            throw error; // Rethrow if you want to propagate the error
        }
    }

    async onModuleInit() {
        console.log('Connecting to Kafka...');
        try {
            console.log('Iniciando');
            
            await this.paymentClient.subscribeToResponseOf('payment.payment.authorize');
            await this.paymentClient.subscribeToResponseOf('payment.payment.refund');
            await this.paymentClient.subscribeToResponseOf('payment.payment.authorize.reply');
            await this.paymentClient.subscribeToResponseOf('payment.payment.refund.reply');
            await this.paymentClient.connect();
            console.log('Connected to Kafka');
        } catch (error) {
            console.error('Failed to connect to Kafka', error);
        }
    }
}
