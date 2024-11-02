import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PaymentStatus } from './payment-status';
import { AbstractDocument } from './abstract';

@Schema({ collection: 'payment_collection' , timestamps: true, versionKey: false })
export class Payment extends AbstractDocument {
  @Prop({ required: true })
  appointmentId: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, enum: PaymentStatus })
  status?: string;

  @Prop({ required: true })
  paymentDate: Date;

}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
