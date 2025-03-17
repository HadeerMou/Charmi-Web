import { Test, TestingModule } from '@nestjs/testing';
import { Product3DService } from './product-threeD.service';

describe('Product3DService', () => {
  let service: Product3DService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Product3DService],
    }).compile();

    service = module.get<Product3DService>(Product3DService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
