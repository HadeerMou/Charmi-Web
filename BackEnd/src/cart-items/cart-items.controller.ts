import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CartItemsService } from './cart-items.service';
import {
  CreateCartItemDto,
  createCartItemSchema,
} from './dto/createCartItem.dto';
import {
  UpdateCartItemDto,
  updateCartItemSchema,
} from './dto/updateCartItem.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { User } from 'src/shared/decorators/user.decorator';
import { Payload } from 'src/types';
import { JoiValidationPipe } from 'src/shared/utils/joiValidations';

@ApiTags('cart-items')
@ApiBearerAuth()
@Controller('cart-items')
export class CartItemsController {
  constructor(private readonly cartItemsService: CartItemsService) {}

  @ApiOperation({ summary: 'Add an item to the cart' })
  @ApiBody({ type: CreateCartItemDto })
  @Roles(Role.User)
  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  async addItem(
    @User() user: Payload,
    @Body(new JoiValidationPipe(createCartItemSchema))
    cartItemDto: CreateCartItemDto,
  ) {
    return await this.cartItemsService.addItem(+user.sub, cartItemDto);
  }

  @ApiOperation({ summary: 'Update the quantity of an item in the cart' })
  @ApiBody({ type: UpdateCartItemDto })
  @Roles(Role.User)
  @UseGuards(AuthGuard, RolesGuard)
  @Put()
  async updateItem(
    @User() user: Payload,
    @Body(new JoiValidationPipe(updateCartItemSchema))
    cartItemDto: UpdateCartItemDto,
  ) {
    return await this.cartItemsService.updateItem(+user.sub, cartItemDto);
  }

  @ApiOperation({ summary: 'Remove an item from the cart' })
  @ApiParam({ name: 'productId', description: 'ID of the product to remove' })
  @Roles(Role.User)
  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':productId')
  async removeItem(
    @User() user: Payload,
    @Param('productId') productId: string,
  ) {
    return await this.cartItemsService.removeItem(+user.sub, +productId);
  }
}
