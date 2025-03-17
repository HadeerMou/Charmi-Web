import { ApiProperty } from '@nestjs/swagger';
import { Express } from 'express';

export class updateProduct3DDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: '3D Model File (.glb, .gltf, .obj)',
  })
  modelFile?: any;
}
