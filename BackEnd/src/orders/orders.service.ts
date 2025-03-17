import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/createOrder.dto';
import prisma from 'src/shared/prisma/client';
import { OrderStatus } from '@prisma/client';
import { MailService } from 'src/mail/mail.service';
import { OrderWithRelations } from 'src/types';

@Injectable()
export class OrdersService {
  constructor(private readonly mailService: MailService) {}

  async create(
    order: CreateOrderDto,
    userId: number,
    request: { order?: any },
  ) {
    const address = await prisma.address.findUnique({
      where: {
        id: order.addressId,
      },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    const shippingFees = await prisma.shippingFees.findUnique({
      where: {
        cityId: address?.cityId,
      },
    });
    const createdOrder = await prisma.orders.create({
      data: {
        userId: userId,
        status: OrderStatus.PENDING,
        total: order.total + (shippingFees?.fee ?? 0),
        shipping: shippingFees?.fee ?? 0,
        addressId: order.addressId,
        orderItems: {
          createMany: {
            data: order.orderItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      },
    });
    await Promise.all(
      order.orderItems.map(async (item) => {
        const product = await prisma.products.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new NotFoundException(
            `Product with ID ${item.productId} not found`,
          );
        }

        if (product.quantity < item.quantity) {
          throw new BadRequestException(
            `Insufficient quantity for product ${product.name}`,
          );
        }

        return prisma.products.update({
          where: { id: item.productId },
          data: { quantity: { decrement: item.quantity } },
        });
      }),
    );
    request.order = await this.findOneById(createdOrder.id);
    return createdOrder;
  }

  async findUserOrders(id: number) {
    return await prisma.orders.findMany({
      where: {
        userId: id,
      },
      include: {
        orderItems: true,
      },
    });
  }

  async findAll() {
    return await prisma.orders.findMany({
      include: {
        orderItems: true,
      },
    });
  }

  async findOneById(id: number) {
    return await prisma.orders.findUnique({
      where: {
        id: id,
      },
      include: {
        orderItems: true,
      },
    });
  }

  async updateOrderStatus(id: number, status: OrderStatus) {
    return await prisma.orders.update({
      where: {
        id: id,
      },
      data: {
        status: status,
      },
    });
  }

  async cancelOrder(id: number) {
    return await this.updateOrderStatus(id, OrderStatus.CANCELLED);
  }

  async confirmOrder(id: number) {
    return await this.updateOrderStatus(id, OrderStatus.DELIVERED);
  }

  async updateOrder() {}

  async sendMail(order: OrderWithRelations) {
    try {
      const user = await prisma.users.findUnique({
        where: { id: order.userId },
      });

      if (!user) {
        throw new Error(`User with ID ${order.userId} not found`);
      }

      const orderItemsWithProductNames = await Promise.all(
        order.orderItems.map(async (item) => {
          const product = await prisma.products.findUnique({
            where: { id: item.productId },
          });

          if (!product) {
            throw new Error(`Product with ID ${item.productId} not found`);
          }

          return {
            name: product.name,
            price: item.price,
            quantity: item.quantity,
          };
        }),
      );

      const calculatedTotal = orderItemsWithProductNames.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      );

      await this.mailService.sendMail(
        user.email,
        'Order Placed',
        './order/createOrder',
        {
          user: {
            name: user.username,
          },
          order: {
            items: orderItemsWithProductNames,
            totalAmount: calculatedTotal,
          },
        },
      );
    } catch (error) {
      console.error('Error sending order email:', error);
      throw new Error('Failed to send order confirmation email');
    }
  }

  async sendMailToAdmins(order: OrderWithRelations, admins: string[]) {
    console.log('sendMailToAdmins in service');

    const user = await prisma.users.findUnique({
      where: {
        id: order.userId,
      },
    });
    await this.mailService.sendMail(
      admins,
      'Order Placed',
      './order/adminOrderCreated',
      {
        user: {
          name: user?.username,
          email: user?.email,
        },
        order: {
          id: order.id,
          items: order.orderItems.map((item) => {
            return {
              name: item.productId,
              price: item.price,
              quantity: item.quantity,
            };
          }),
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          totalAmount: order.total,
          totalQuantity: order.orderItems.reduce(
            (acc, x) => acc + x.quantity,
            0,
          ),
        },
      },
    );
  }
}
