import Joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';

export class updateProductDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  price: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  categoryId: number;
}

export const updateProductSchema = Joi.object<updateProductDto>({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  quantity: Joi.number().required(),
  categoryId: Joi.number().required(),
});
