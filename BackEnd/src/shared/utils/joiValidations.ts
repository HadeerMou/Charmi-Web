import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ObjectSchema, ValidationError } from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  async transform(value: any): Promise<any> {
    try {
      console.log(value);
      await this.schema.validateAsync(value, {
        abortEarly: false,
        allowUnknown: true,
      });

      return value;
    } catch (error) {
      console.log(error);
      if (error instanceof ValidationError) {
        throw new BadRequestException(
          `Validation failed: ${error.details.map((x) => x.message).join(', ')}`,
        );
      }
      throw new BadRequestException(
        `Validation failed: ${(error as Error).message}`,
      );
    }
  }
}
