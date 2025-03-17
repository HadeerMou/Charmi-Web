import { ApiProperty } from '@nestjs/swagger';
import Joi from 'joi';

export class CreateOrderDto {
  @ApiProperty()
  total: number;

  @ApiProperty()
  addressId: number;

  @ApiProperty({ type: () => [OrderDetailsDto] })
  orderItems: OrderDetailsDto[];
}

export class OrderDetailsDto {
  @ApiProperty()
  productId: number;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  price: number;
}

export const createOrderSchema = Joi.object({
  total: Joi.number().required(),
  addressId: Joi.number().required(),
  orderItems: Joi.array().items(
    Joi.object({
      productId: Joi.number().required(),
      quantity: Joi.number().required(),
      price: Joi.number().required(),
    }),
  ),
});
