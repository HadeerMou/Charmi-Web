import { ApiProperty } from '@nestjs/swagger';
import Joi from 'joi';

export class CreateShippingFeeDto {
  @ApiProperty()
  cityId: number;

  @ApiProperty()
  fee: number;
}

export const createShippingFeeSchema = Joi.object<CreateShippingFeeDto>().keys({
  cityId: Joi.number().integer().required(),
  fee: Joi.number().min(0).required(),
});
