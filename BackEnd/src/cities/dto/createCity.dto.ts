import { ApiProperty } from '@nestjs/swagger';
import Joi from 'joi';

export class CreateCityDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  countryId: number;
}

export const createCitySchema = Joi.object({
  name: Joi.string().required(),
  countryId: Joi.number().required(),
});
