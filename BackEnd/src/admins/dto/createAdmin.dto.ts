import { ApiProperty } from '@nestjs/swagger';
import Joi from 'joi';

export class CreateAdminDto {
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
}

export const CreateAdminSchema = Joi.object<CreateAdminDto>().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
