import { Availability } from "src/entities/availability.schema";

export interface AvailabilityServiceInterface {
  createAvailability(date: string, timeSlot: string): Promise<Availability>;
  checkAvailability(date: string, timeSlot: string): Promise<boolean>;
  reserveSlot(date: string, timeSlot: string, serviceId: string): Promise<Availability>;
  releaseSlot(date: string, timeSlot: string): Promise<Availability>;
}