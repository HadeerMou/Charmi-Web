import { Injectable, NotFoundException } from '@nestjs/common';
import prisma from 'src/shared/prisma/client';

@Injectable()
export class CartService {
  private async findOrCreateCart(userId: number) {
    return await prisma.carts.upsert({
      where: { userId },
      update: {},
      create: { userId },
      include: { cartItems: true },
    });
  }

  async getUserCart(userId: number) {
    const cart = await this.findOrCreateCart(userId);
    return cart;
  }

  async clearCart(userId: number) {
    const cart = await prisma.carts.findUnique({
      where: {
        userId,
      },
    });

    if (!cart) {
      throw new NotFoundException('Could not find requested Cart');
    }

    return await prisma.carts.update({
      where: {
        id: cart.id,
      },
      data: {
        cartItems: {
          deleteMany: {},
        },
      },
    });
  }
}
