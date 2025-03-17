import { Module } from '@nestjs/common';
import { Product3DController } from './product-threeD.controller';
import { Product3DService } from './product-threeD.service';

@Module({
  controllers: [Product3DController],
  providers: [Product3DService],
})
export class Product3DModule {}
