import { ApiProperty } from '@nestjs/swagger';
import Joi from 'joi';

export class UpdateAddressDto {
  @ApiProperty()
  streetName: string;

  @ApiProperty()
  districtId: string;

  @ApiProperty()
  isDefault: boolean;

  @ApiProperty()
  apartmentNumber: string;

  @ApiProperty()
  buildingNumber: string;

  @ApiProperty()
  countryId: number;

  @ApiProperty()
  cityId: number;
}

export const updateAddressSchema = Joi.object<UpdateAddressDto>({
  buildingNumber: Joi.string().required(),
  streetName: Joi.string().required(),
  districtId: Joi.string().required(),
  countryId: Joi.number().integer().required(),
  cityId: Joi.number().integer().required(),
  isDefault: Joi.boolean().required(),
  apartmentNumber: Joi.string().optional(),
});
