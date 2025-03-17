import { ApiProperty } from '@nestjs/swagger';
import Joi from 'joi';

export class signUpDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  phone: string;
}

export const signUpSchema = Joi.object<signUpDto>({
  email: Joi.string().email().trim().required(),
  password: Joi.string()
    .min(8)
    .max(20)
    /* .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_-]).{8,20}$/,
    ) */
    .required(),
  username: Joi.string().trim().min(3).max(30).required(),
  phone: Joi.string()
    .trim()
    .pattern(/^\+?[0-9]{10,15}$/)
    .required(),
});
