import { ApiProperty } from '@nestjs/swagger';
import Joi from 'joi';

export class CreateCartItemDto {
  @ApiProperty()
  productId: number;

  @ApiProperty()
  quantity: number;
}

export const createCartItemSchema = Joi.object<CreateCartItemDto>().keys({
  productId: Joi.number().integer().required(),
  quantity: Joi.number().integer().required(),
});
