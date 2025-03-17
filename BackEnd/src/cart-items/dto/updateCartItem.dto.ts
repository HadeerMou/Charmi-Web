import { ApiProperty } from '@nestjs/swagger';
import Joi from 'joi';

export class UpdateCartItemDto {
  @ApiProperty()
  product_id: number;

  @ApiProperty()
  quantity: number;
}

export const updateCartItemSchema = Joi.object<UpdateCartItemDto>().keys({
  product_id: Joi.number().integer().required(),
  quantity: Joi.number().integer().required(),
});
