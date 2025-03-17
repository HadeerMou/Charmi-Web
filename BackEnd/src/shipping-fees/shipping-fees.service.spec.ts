import { Test, TestingModule } from '@nestjs/testing';
import { ShippingFeesService } from './shipping-fees.service';

describe('ShippingFeesService', () => {
  let service: ShippingFeesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShippingFeesService],
    }).compile();

    service = module.get<ShippingFeesService>(ShippingFeesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
