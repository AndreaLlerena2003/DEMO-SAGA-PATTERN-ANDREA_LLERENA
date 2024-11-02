import { IsString, IsNumber, IsNotEmpty, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class CreateSpaServiceDto {
  @IsString()
  @ApiProperty({ description: 'Spa Service ID' })
  serviceId: string;

  @IsNumber()
  @ApiProperty({ description: 'Price of the reserved service' })
  totalPrice: number;
}


export class CreateSpaReservationDto {
  @IsString()
  @ApiProperty({ description: 'ID of the customer who made the reservation' })
  customerId: string;

  @IsNotEmpty()
  @ApiProperty({ type: () => CreateSpaServiceDto, description: 'Service that can be booked at the spa' }) 
  spaService: CreateSpaServiceDto;

  @IsDateString()
  @ApiProperty({ description: 'Date of the reservation in ISO format (yyyy-mm-dd)' })
  reservationDate: string; 

  @IsString() 
  @ApiProperty({ description: 'Booking time for this specific service (HH:mm format)' })
  reservationTime: string; 

  status?: string;
}
