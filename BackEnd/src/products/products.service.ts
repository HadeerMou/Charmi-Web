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
        productImages: true,
      },
    });
  }

  async findOne(id: number) {
    return await prisma.products.findUnique({
      include: {
        productImages: true,
      },
      where: {
        id: id,
      },
    });
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
