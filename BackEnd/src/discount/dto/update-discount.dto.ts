import Joi from 'joi';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateDiscountDto } from './create-discount.dto';

export class UpdateDiscountDto extends PartialType(CreateDiscountDto) {}

export const updateDiscountSchema = Joi.object<UpdateDiscountDto>({
  percentage: Joi.number().min(0).max(100),
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso(),
  isActive: Joi.boolean(),
  productIds: Joi.array().items(Joi.number()),
});
