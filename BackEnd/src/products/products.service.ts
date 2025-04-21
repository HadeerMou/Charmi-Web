import { Injectable } from '@nestjs/common';
import prisma from 'src/shared/prisma/client';
import { createProductDto } from './dto/createProduct.dto';
import { updateProductDto } from './dto/updateProduct.dto';

@Injectable()
export class ProductsService {
  async findAll() {
    return await prisma.products.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        discount: true,
        productImages: true,
        productModel: true,
      },
    });
  }

  async findOne(id: number) {
    const product = await prisma.products.findUnique({
      include: {
        discount: true,
        productImages: true,
        productModel: true,
      },
      where: {
        id: id,
      },
    });
    if (product?.productModel?.modelPath) {
      product.productModel.modelPath = product.productModel.modelPath
        .trim()
        .replace(/\s/g, '%20'); // Fix spaces in URL
    }
    return product;
  }

  async create(product: createProductDto) {
    return await prisma.products.create({
      data: {
        ...product,
      },
    });
  }

  async update(id: number, product: updateProductDto) {
    return await prisma.products.update({
      data: {
        ...product,
      },
      where: {
        id: id,
      },
    });
  }

  async delete(id: number) {
    return await prisma.products.update({
      data: {
        deletedAt: new Date(),
      },
      where: {
        id: id,
      },
    });
  }
}
