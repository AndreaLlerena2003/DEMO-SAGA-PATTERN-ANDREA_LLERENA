import { MessagePattern, Payload } from '@nestjs/microservices';
import { Controller, Inject } from '@nestjs/common';
import { AvailabilityServiceInterface } from 'src/services/availability.service.interface';

type CheckAvailabilityMessage = {
    slots: [
      {
        date: string;
        timeSlot: string;
      },
    ];
  };


@Controller()
export class CheckAvailabilityController{
    constructor(
        @Inject('availability-service')
        private readonly service: AvailabilityServiceInterface,
    ) {}

    @MessagePattern('availability.slots.check')
    async checkAvailability(@Payload() message: CheckAvailabilityMessage) {
    const availabilityResults = await Promise.all(
      message.slots.map(async ({ date, timeSlot }) => {
        const isAvailable = await this.service.checkAvailability(date, timeSlot);
        return { date, timeSlot, available: isAvailable };
      }),
    );

    return { slots: availabilityResults };
  }
}
