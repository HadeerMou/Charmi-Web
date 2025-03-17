import Joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';

export class createProduct3DDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: '3D Model File (.glb, .gltf, .obj)',
    required: true,
  })
  modelFile: any;

  @ApiProperty({ description: 'ID of the associated product', required: true })
  productId: number;
}

export const createProduct3DSchema = Joi.object({
  productId: Joi.number().required().messages({
    'number.base': 'productId must be a number',
    'any.required': 'productId is required',
  }),
});
