import { Test, TestingModule } from '@nestjs/testing';
import { Product3DController } from './product-threeD.controller';

describe('ProductThreeDController', () => {
  let controller: Product3DController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Product3DController],
    }).compile();

    controller = module.get<Product3DController>(Product3DController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
