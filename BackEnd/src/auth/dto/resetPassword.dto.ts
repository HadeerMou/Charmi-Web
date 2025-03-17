import { ApiProperty } from '@nestjs/swagger';
import Joi from 'joi';

export class ResetPasswordDTO {
  @ApiProperty()
  otp: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  newPassword: string;
}

export const ResetPasswordDTOSchema = Joi.object<ResetPasswordDTO>().keys({
  otp: Joi.string().required(),
  email: Joi.string().email().required(),
  newPassword: Joi.string().min(8).max(20).required(),
  /* .pattern(
      new RegExp(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,20}$',
      ),
    ), */
});
