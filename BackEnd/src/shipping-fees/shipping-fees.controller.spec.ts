import { Test, TestingModule } from '@nestjs/testing';
import { ShippingFeesController } from './shipping-fees.controller';

describe('ShippingFeesController', () => {
  let controller: ShippingFeesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShippingFeesController],
    }).compile();

    controller = module.get<ShippingFeesController>(ShippingFeesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
