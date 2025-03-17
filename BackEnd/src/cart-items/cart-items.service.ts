import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartItemDto } from './dto/createCartItem.dto';
import { UpdateCartItemDto } from './dto/updateCartItem.dto';
import prisma from 'src/shared/prisma/client';

@Injectable()
export class CartItemsService {
  async addItem(userId: number, cartItemDto: CreateCartItemDto) {
    let cart = await prisma.carts.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!cart) {
      cart = await prisma.carts.create({
        data: {
          userId: userId,
        },
      });
    }

    const product = await prisma.products.findUnique({
      where: {
        id: cartItemDto.productId,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return await prisma.cartItems.upsert({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: cartItemDto.productId,
        },
      },
      update: {
        quantity: {
          increment: cartItemDto.quantity,
        },
      },
      create: {
        cartId: cart.id,
        productId: cartItemDto.productId,
        quantity: cartItemDto.quantity,
      },
    });
  }

  async updateItem(userId: number, updateCartItemDto: UpdateCartItemDto) {
    const cart = await prisma.carts.findUnique({
      where: { userId: userId },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const product = await prisma.products.findUnique({
      where: {
        id: updateCartItemDto.product_id,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return await prisma.cartItems.update({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: updateCartItemDto.product_id,
        },
      },
      data: {
        quantity: updateCartItemDto.quantity,
      },
    });
  }

  async removeItem(userId: number, productId: number) {
    const cart = await prisma.carts.findUnique({
      where: { userId: userId },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const existingCartItem = await prisma.cartItems.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: productId,
        },
      },
    });

    if (!existingCartItem) {
      throw new NotFoundException('Cart item not found');
    }

    await prisma.cartItems.delete({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: productId,
        },
      },
    });
  }
}
