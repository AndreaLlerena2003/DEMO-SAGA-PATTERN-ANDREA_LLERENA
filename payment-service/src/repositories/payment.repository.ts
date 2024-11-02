import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Payment } from 'src/entities/payment.schema';
import { Injectable , Logger} from '@nestjs/common';
import { AbstractRepository } from './abstract.repository';


@Injectable()
export class PaymentRepository extends AbstractRepository<Payment> {
  protected readonly logger = new Logger(PaymentRepository.name);
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    @InjectConnection() connection: Connection,
  ) {
    super(paymentModel,connection);
  }

}
