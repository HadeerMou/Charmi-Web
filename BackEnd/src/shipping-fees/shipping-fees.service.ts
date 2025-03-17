import { Injectable, NotFoundException } from '@nestjs/common';
import prisma from 'src/shared/prisma/client';
import { CreateShippingFeeDto } from './dto/shippingFees.dto';

@Injectable()
export class ShippingFeesService {
  constructor() {}
  async create(shippingFee: CreateShippingFeeDto) {
    return await prisma.shippingFees.create({
      data: {
        fee: shippingFee.fee,
        Cities: {
          connect: { id: shippingFee.cityId },
        },
      },
    });
  }

  async findAll() {
    return await prisma.shippingFees.findMany({ where: { deletedAt: null } });
  }

  async findOne(id: number) {
    let shippingFee = await prisma.shippingFees.findUnique({
      where: {
        cityId: id,
      },
    });

    if (!shippingFee) {
      shippingFee = await prisma.shippingFees.findFirst({
        where: {
          cityId: id,
        },
        orderBy: {
          fee: 'desc',
        },
      });
    }
    if (!shippingFee) throw new NotFoundException('Shipping Fee not found');
    return shippingFee;
  }

  async update(id: number, shippingFee: CreateShippingFeeDto) {
    const shippingFeeToUpdate = await prisma.shippingFees.findUnique({
      where: { id },
    });

    if (shippingFeeToUpdate) {
      return await prisma.shippingFees.update({
        where: { id },
        data: { ...shippingFee },
      });
    }
    throw new NotFoundException('Shipping Fee not found');
  }

  async delete(id: number): Promise<any> {
    const feeToDelete = await prisma.shippingFees.findUnique({ where: { id } });

    if (feeToDelete) {
      return await prisma.shippingFees.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    }
    throw new NotFoundException('Shipping Fee not found');
  }
}
