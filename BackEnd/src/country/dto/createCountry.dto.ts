import { ApiProperty } from '@nestjs/swagger';
import Joi from 'joi';

export class CreateCountryDto {
  @ApiProperty()
  name: string;
}

export const createCountrySchema = Joi.object({
  name: Joi.string().required(),
});
