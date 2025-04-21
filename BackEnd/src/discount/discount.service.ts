import { Injectable } from '@nestjs/common';
import prisma from 'src/shared/prisma/client';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';

@Injectable()
export class DiscountService {
  async findAll() {
    return prisma.discount.findMany({
      include: { products: true },
    });
  }

  async findOne(id: number) {
    return prisma.discount.findUnique({
      where: { id },
      include: { products: true },
    });
  }

  async create(data: CreateDiscountDto) {
    if (!data.productIds || !Array.isArray(data.productIds)) {
      throw new Error('productIds must be a valid array');
    }
    return prisma.discount.create({
      data: {
        percentage: data.percentage,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        isActive: data.isActive,
        products: {
          connect: data.productIds.map((id) => ({ id })),
        },
      },
    });
  }

  async update(id: number, data: UpdateDiscountDto) {
    const productIds = data.productIds;

    return prisma.discount.update({
      where: { id },
      data: {
        percentage: data.percentage,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        isActive: data.isActive,
        products: productIds
          ? {
              set: Array.isArray(productIds)
                ? productIds.map((id) => ({ id }))
                : [],
            }
          : undefined,
      },
    });
  }

  async delete(id: number) {
    return prisma.discount.delete({
      where: { id },
    });
  }
}
