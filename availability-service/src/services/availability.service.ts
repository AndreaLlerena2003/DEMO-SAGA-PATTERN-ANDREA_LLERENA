import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AvailabilityRepository } from 'src/repositories/availability.repository';
import { Availability } from '../entities/availability.schema';
import { AvailabilityServiceInterface } from './availability.service.interface';

@Injectable()
export class AvailabilityService implements AvailabilityServiceInterface {
    private readonly logger = new Logger(AvailabilityService.name);
    constructor(private readonly availabilityRepository: AvailabilityRepository) {}
    
    async createAvailability(date: string, timeSlot: string): Promise<Availability> {
        this.logger.log('Creating availability...');
        return this.availabilityRepository.create({ date, timeSlot, isAvailable: true });
    }

    async checkAvailability(date: string, timeSlot: string): Promise<boolean> {
        this.logger.log(`Checking availability for date: ${date} at ${timeSlot}`);
        const availability = await this.availabilityRepository.findOne({date: date, timeSlot: timeSlot});
        return availability ? availability.isAvailable : false;
    }

    async reserveSlot(date: string, timeSlot: string, serviceId: string): Promise<Availability> {
        this.logger.log(`Reserving slot for date: ${date} at ${timeSlot} with serviceId: ${serviceId}`);
        const availability = await this.availabilityRepository.findOne({ date, timeSlot });
        if (!availability || !availability.isAvailable) {
          throw new NotFoundException('Slot not available');
        }
        const updatedAvailability = await this.availabilityRepository.findOneAndUpdate(
          { date, timeSlot },
          { isAvailable: false, serviceId }
        );
        if (!updatedAvailability) {
          throw new NotFoundException('Failed to reserve slot');
        }
        this.logger.log('Slot reserved successfully');
        return updatedAvailability;
    }

    async releaseSlot(date: string, timeSlot: string): Promise<Availability> {
        this.logger.log(`Realseasing slot for date: ${date} at ${timeSlot}`);
        const availability = await this.availabilityRepository.findOne({ date, timeSlot });
        if (!availability) {
          throw new NotFoundException('Availability not found');
        }
        const updatedAvailability = await this.availabilityRepository.findOneAndUpdate(
            { date, timeSlot },
            { isAvailable: true, serviceId: null }
        );
        if (!updatedAvailability) {
            throw new NotFoundException('Failed to reserve slot');
        }
        this.logger.log('Slot release successfully');
        return updatedAvailability;
    }
    
}
