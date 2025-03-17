import { ApiProperty } from '@nestjs/swagger';
import Joi from 'joi';

export class loginDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    required: true,
  })
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'StrongP@ss123',
    required: true,
    minLength: 8,
  })
  password: string;
}

export const loginSchema = Joi.object<loginDto>({
  email: Joi.string().required(),
  password: Joi.string().required(),
});
