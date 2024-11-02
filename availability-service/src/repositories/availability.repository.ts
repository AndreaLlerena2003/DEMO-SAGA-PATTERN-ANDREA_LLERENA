import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Availability } from '../entities/availability.schema';

import { Injectable , Logger} from '@nestjs/common';
import { AbstractRepository } from './abstract.repository';


@Injectable()
export class AvailabilityRepository extends AbstractRepository<Availability> {
  protected readonly logger = new Logger(AvailabilityRepository.name);
  constructor(
    @InjectModel(Availability.name) private availabilityModel: Model<Availability>,
    @InjectConnection() connection: Connection,
  ) {
    super(availabilityModel,connection);
  }

}
