import Joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';

export class createProductImagesDto {
  @ApiProperty()
  isDefault: boolean;

  @ApiProperty({ type: 'string', format: 'binary' })
  imageFile: any;

  @ApiProperty()
  productId: number;
}

export const createProductImagesSchema = Joi.object<createProductImagesDto>({
  isDefault: Joi.boolean().required(),
  productId: Joi.number().required(),
});
