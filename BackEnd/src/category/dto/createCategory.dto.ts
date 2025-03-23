import { ApiProperty } from '@nestjs/swagger';
import Joi from 'joi';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Category name in English' })
  nameEn: string;

  @ApiProperty({ description: 'Category name in Arabic' })
  nameAr: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  imageFile: any;
}

export const createCategorySchema = Joi.object<CreateCategoryDto>().keys({
  nameEn: Joi.string().required().messages({
    'string.empty': 'Category name in English is required',
  }),
  nameAr: Joi.string().required().messages({
    'string.empty': 'Category name in Arabic is required',
  }),
});
