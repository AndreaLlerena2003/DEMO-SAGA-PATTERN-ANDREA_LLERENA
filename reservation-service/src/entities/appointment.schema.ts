import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from './abstract';
import { v4 as uuidv4 } from 'uuid';

type ServiceData = {
  serviceId: string;
  price: number;
};

@Schema({ collection: 'appointments_collection' , timestamps: true, versionKey: false })
export class Appointment extends AbstractDocument {
  @Prop({ required: true })
  customerId: string;

  @Prop({ required: true }) 
  appointmentId: string;

  @Prop({ required: true})
  status: string;

  @Prop({ required: true })
  appointmentDate: string;

  @Prop({ required: true })
  appointmentHour: string;

  @Prop({ 
    required: true, 
    type: { 
      serviceId: { type: String, required: true },
      price: { type: Number, required: true } 
    },
    _id: false  
  })
  service: ServiceData;

  @Prop({ required: true })
  totalPrice: number;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
