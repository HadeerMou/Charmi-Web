import Joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty()
  phone: string;
}

export const updateUserSchema = Joi.object<UpdateUserDto>({
  phone: Joi.string()
    .trim()
    .pattern(/^\+?[0-9]{10,15}$/)
    .required(),
});
