import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  UseInterceptors,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { Injectable, Post, UseGuards } from '@nestjs/common';
import { CreateOrderDto, createOrderSchema } from './dto/createOrder.dto';
import { OrdersService } from './orders.service';
import { MailService } from '../mail/mail.service';
import { User } from 'src/shared/decorators/user.decorator';
import { OrderStatus } from '@prisma/client';
import { Payload } from 'src/types';
import { SendOrderAfterCreationInterceptor } from 'src/shared/interceptors/SendOrderAfterCreationInterceptor';
import { JoiValidationPipe } from 'src/shared/utils/joiValidations';

@ApiTags('orders')
@ApiBearerAuth()
@Injectable()
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly mailService: MailService,
  ) {}

  @UseInterceptors(SendOrderAfterCreationInterceptor)
  @ApiOperation({ summary: 'Create order' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.User)
  @ApiBody({ type: CreateOrderDto })
  @Post()
  async create(
    @Body(new JoiValidationPipe(createOrderSchema)) order: CreateOrderDto,
    @User() user: Payload,
    @Request() request,
  ) {
    return await this.ordersService.create(order, user.sub, request);
  }

  @ApiOperation({ summary: 'Get orders by user ID' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.User)
  @Get('user')
  async findUserOrders(@User() user: Payload) {
    return await this.ordersService.findUserOrders(user.sub);
  }

  @ApiOperation({ summary: 'Get all orders for admin' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('all')
  async findAll() {
    return await this.ordersService.findAll();
  }

  @ApiOperation({ summary: 'Get order by order ID' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  @Get(':id')
  async findOneById(@Param('id') id: string) {
    return await this.ordersService.findOneById(+id);
  }

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', enum: Object.values(OrderStatus) },
      },
    },
  })
  @ApiOperation({ summary: 'Update order status' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Put(':id/status')
  async updateOrderStatus(
    @Param('id') id: string,
    @Param('status') status: OrderStatus,
  ) {
    return await this.ordersService.updateOrderStatus(+id, status);
  }

  @ApiOperation({ summary: 'Cancel Order' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.User)
  @Post(':id/cancel')
  async cancelOrder(@Param('id') id: string) {
    return await this.ordersService.updateOrderStatus(
      +id,
      OrderStatus.CANCELLED,
    );
  }

  @ApiOperation({ summary: 'Order Confirm status' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post(':id/confirm')
  async confirmOrder(@Param('id') id: string) {
    return await this.ordersService.updateOrderStatus(
      +id,
      OrderStatus.DELIVERED,
    );
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Put()
  async updateOrder() {}
}
