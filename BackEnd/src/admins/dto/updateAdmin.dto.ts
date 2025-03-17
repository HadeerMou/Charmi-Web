import { ApiProperty } from '@nestjs/swagger';
import Joi from 'joi';

export class updateAdminDto {
  @ApiProperty()
  email: string;

  password: string;
}

export const updateAdminSchema = Joi.object<updateAdminDto>().keys({
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .max(20)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_-]).{8,20}$/,
    )
    .required(),
});
