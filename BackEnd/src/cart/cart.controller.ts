import { Controller, Delete, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CartService } from 'src/cart/cart.service';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { User } from 'src/shared/decorators/user.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Payload } from 'src/types';

@ApiTags('Cart')
@ApiBearerAuth()
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiOperation({ summary: "Get the user's cart" })
  @Roles(Role.User)
  @UseGuards(AuthGuard, RolesGuard)
  @Get()
  async getUserCart(@User() user: Payload) {
    return await this.cartService.getUserCart(user.sub);
  }

  @ApiOperation({ summary: "Clear the user's cart" })
  @Roles(Role.User)
  @UseGuards(AuthGuard, RolesGuard)
  @Delete()
  async clearCart(@User() user: Payload) {
    return await this.cartService.clearCart(user.sub);
  }
}
