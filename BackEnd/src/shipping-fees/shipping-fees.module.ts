import { Module } from '@nestjs/common';
import { ShippingFeesService } from './shipping-fees.service';
import { ShippingFeesController } from './shipping-fees.controller';

@Module({
  providers: [ShippingFeesService],
  controllers: [ShippingFeesController]
})
export class ShippingFeesModule {}
