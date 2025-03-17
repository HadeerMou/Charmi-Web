import Joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';

export class updateProductImagesDto {
  @ApiProperty()
  isDefault: boolean;

  @ApiProperty({ type: 'string', format: 'binary' })
  imageFile: any;
}

export const updateProductImagesSchema = Joi.object<updateProductImagesDto>({
  isDefault: Joi.boolean().required(),
});
