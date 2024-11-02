import {MessagePattern, Payload} from '@nestjs/microservices';
import { Controller, Inject } from '@nestjs/common';
import { AvailabilityServiceInterface } from 'src/services/availability.service.interface'

type UpdateAvailabilityMessage = {
    slots: [
      {
        date: string;
        timeSlot: string;
        serviceId?: string
      },
    ];
  };

type CreateAvailabilityMessage = {
    date: string;
    timeSlot: string;
};
  
  
  @Controller()
  export class UpdateAvailabilityController {
    constructor(
      @Inject('availability-service')
      private readonly service: AvailabilityServiceInterface,
    ) {}
  
    @MessagePattern('availability.slots.reserve')
    async reserveSlots(@Payload() message: UpdateAvailabilityMessage) {
      console.info('Availability Service: Reserving slots');
  
      await Promise.all(
        message.slots.map(async ({ date, timeSlot, serviceId }) => {
          const slotReserved = await this.service.reserveSlot(date, timeSlot, serviceId);
          if (!slotReserved) {
            throw new Error(`Slot not available: ${date} at ${timeSlot}`);
          }
        }),
      );
  
      return {
        success: true,
        message: 'Slots reserved successfully',
      };
    }
  
    @MessagePattern('availability.slots.release')
    async releaseSlots(@Payload() message: UpdateAvailabilityMessage) {
      console.info('Availability Service: Releasing slots');
  
      await Promise.all(
        message.slots.map(async ({ date, timeSlot }) => {
          await this.service.releaseSlot(date, timeSlot);
        }),
      );
  
      return {
        success: true,
        message: 'Slots released successfully',
      };
    }

    @MessagePattern('availability.slots.create')
    async createSlot(@Payload() message: CreateAvailabilityMessage) {
      console.info('Availability Service: Creating slot');
      const newSlot = await this.service.createAvailability(message.date, message.timeSlot);
      return {
        success: true,
        message: 'Slot created successfully',
        slot: newSlot,
      };
    }
  }