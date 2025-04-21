import Joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDiscountDto {
  @ApiProperty()
  percentage: number;

  @ApiProperty()
  startDate: string;

  @ApiProperty()
  endDate: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty({ type: [Number] })
  productIds: number[];
}

export const createDiscountSchema = Joi.object<CreateDiscountDto>({
  percentage: Joi.number().min(0).max(100).required(),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().required(),
  isActive: Joi.boolean().required(),
  productIds: Joi.array().items(Joi.number()).required(),
});
