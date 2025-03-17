import { ApiProperty } from '@nestjs/swagger';
import Joi from 'joi';

export class CreateCategoryDto {
  @ApiProperty()
  name: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  imageFile: any;
}

export const createCategorySchema = Joi.object<CreateCategoryDto>().keys({
  name: Joi.string().required(),
});
