import { Injectable, OnModuleInit } from '@nestjs/common';
import { Step } from './steps/steps';
import { Appointment } from 'src/entities/appointment.schema';
import { PlaceAppointmentStep } from './steps/place-appoitment.step';
import { AuthorizePaymentStep } from './steps/authorize-payment.step';
import { ConfirmAppointmentStep } from './steps/confirm-appointment.step';
import { UpdateAvailibilityStep } from './steps/update-availibility.step';
import { CheckAvailibityStep } from './steps/check-product-availibilty.step';

@Injectable()
export class CreateAppointmentSaga implements OnModuleInit {
    private steps: Step<Appointment, void>[];
    private successfulSteps: Step<Appointment, void>[];

    constructor(
        placeAppointmentStep: PlaceAppointmentStep,
        checkAvailabilityStep: CheckAvailibityStep,
        authorizePaymentStep: AuthorizePaymentStep,
        confirmAppointmentStep: ConfirmAppointmentStep,
        updateAvailabilityStep: UpdateAvailibilityStep,
    ) {
        this.steps = [
            placeAppointmentStep,
            checkAvailabilityStep,
            authorizePaymentStep,
            confirmAppointmentStep,
            updateAvailabilityStep,
        ];
        this.successfulSteps = [];
    }

    async execute(appointment: Appointment) {
        for (let step of this.steps) {
            try {
                console.info(`Invoking: ${step.name} ...`);
                await step.invoke(appointment);
                this.successfulSteps.unshift(step);
            } catch (error) {
                console.error(`Failed Step: ${step.name} !!`);
                await this.rollbackSuccessfulSteps(appointment);
                throw error; 
            }
        }
        console.info('Appointment Creation Transaction ended successfully');
    }

    private async rollbackSuccessfulSteps(appointment: Appointment) {
        await Promise.all(this.successfulSteps.map(async (s) => {
            console.info(`Rolling back: ${s.name} ...`);
            await s.withCompenstation(appointment);
        }));
    }

    async onModuleInit() {
        console.log('Starting...');
    }
}
