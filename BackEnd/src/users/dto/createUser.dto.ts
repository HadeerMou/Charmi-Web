import Joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  phone: string;
}

export const createUserSchema = Joi.object<CreateUserDto>({
  email: Joi.string().email().trim().required(),
  password: Joi.string()
    .min(6)
    .max(20)
    /*     .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_-]).{8,20}$/,
    ) */
    .required(),
  username: Joi.string().trim().min(3).max(30).required(),
  phone: Joi.string()
    .trim()
    .pattern(/^\+?[0-9]{10,15}$/)
    .required(),
});
