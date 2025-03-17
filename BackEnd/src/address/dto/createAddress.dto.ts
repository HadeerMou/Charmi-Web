import { ApiProperty } from '@nestjs/swagger';
import Joi from 'joi';

export class CreateAddressDto {
  @ApiProperty()
  streetName: string;

  @ApiProperty()
  districtId: string;

  @ApiProperty()
  apartmentNumber: string;

  @ApiProperty()
  buildingNumber: string;

  @ApiProperty()
  countryId: number;

  @ApiProperty()
  cityId: number;

  @ApiProperty()
  isDefault: boolean;
}

export const createAddressSchema = Joi.object<CreateAddressDto>({
  buildingNumber: Joi.string().required(),
  streetName: Joi.string().required(),
  districtId: Joi.string().required(),
  countryId: Joi.number().integer().required(),
  cityId: Joi.number().integer().required(),
  apartmentNumber: Joi.string().optional(),
  isDefault: Joi.boolean().required(),
});
