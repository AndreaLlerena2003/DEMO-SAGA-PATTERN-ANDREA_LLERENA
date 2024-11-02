import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import { AbstractDocument } from './abstract';

@Schema({ collection: 'availability_collection' , timestamps: true, versionKey: false })
export class Availability extends AbstractDocument{
    @Prop()
    serviceId?: string;
  
    @Prop({ required: true })
    date: string; 

    @Prop({ required: true })
    timeSlot: string; 

    @Prop()
    timeSlotEnd?: string;
  
    @Prop({ required: true, default: true })
    isAvailable: boolean; 
}

export const AvailabilitySchema = SchemaFactory.createForClass(Availability);

AvailabilitySchema.pre('save', function (next) {
    const [hours, minutes] = this.timeSlot.split(':').map(Number);
    const endTime = new Date();
    endTime.setHours(hours + 1);
    endTime.setMinutes(minutes);
    this.timeSlotEnd = `${String(endTime.getHours()).padStart(2, '0')}:${String(endTime.getMinutes()).padStart(2, '0')}`;
    next();
  });