import Joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';

export class createProductDto {
  @ApiProperty()
  nameEn: string;

  @ApiProperty()
  nameAr: string;

  @ApiProperty()
  descriptionEn: string;

  @ApiProperty()
  descriptionAr: string;

  @ApiProperty()
  priceEgp: string;

  @ApiProperty()
  priceUsd: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  categoryId: number;
}

export const createProductSchema = Joi.object<createProductDto>({
  nameEn: Joi.string().required(),
  nameAr: Joi.string().required(),
  descriptionEn: Joi.string().required(),
  descriptionAr: Joi.string().required(),
  priceEgp: Joi.number().required(),
  priceUsd: Joi.number().required(),
  quantity: Joi.number().required(),
  categoryId: Joi.number().required(),
});
