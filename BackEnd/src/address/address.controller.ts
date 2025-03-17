import { Controller, NotFoundException, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Get, Param, Post, Delete, Put, Body } from '@nestjs/common';
import { CreateAddressDto, createAddressSchema } from './dto/createAddress.dto';
import { UpdateAddressDto, updateAddressSchema } from './dto/updateAddress.dto';
import { AddressService } from './address.service';
import { User } from 'src/shared/decorators/user.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Payload } from 'src/types';
import { JoiValidationPipe } from 'src/shared/utils/joiValidations';
@ApiBearerAuth()
@ApiTags('address')
@Controller('address')
export class AddressController {
  constructor(private readonly addressesService: AddressService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Returns all addresses' })
  async getAllAddresses() {
    return await this.addressesService.getAllAddresses();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number, description: 'Address ID' })
  @ApiResponse({ status: 200, description: 'Returns the address by ID' })
  @ApiResponse({ status: 404, description: 'Address not found' })
  async getAddressById(@Param('id') id: number) {
    try {
      return await this.addressesService.getAddressById(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.User)
  @ApiBody({ type: CreateAddressDto })
  @ApiResponse({ status: 201, description: 'Address created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createAddress(
    @User() user: Payload,
    @Body(new JoiValidationPipe(createAddressSchema))
    createAddressDto: CreateAddressDto,
  ) {
    console.log('🚀 Received body:', createAddressDto); // Debug log
    return await this.addressesService.createAddress(
      user.sub,
      createAddressDto,
    );
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiParam({ name: 'id', type: Number, description: 'Address ID' })
  @ApiBody({ type: UpdateAddressDto })
  @ApiResponse({ status: 200, description: 'Address updated successfully' })
  @ApiResponse({ status: 404, description: 'Address not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async updateAddress(
    @Param('id') id: number,
    @Body(new JoiValidationPipe(updateAddressSchema))
    updateAddressDto: UpdateAddressDto,
  ) {
    try {
      return await this.addressesService.updateAddress(id, updateAddressDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiParam({ name: 'id', type: Number, description: 'Address ID' })
  @ApiResponse({ status: 200, description: 'Address deleted successfully' })
  @ApiResponse({ status: 404, description: 'Address not found' })
  async deleteAddress(@Param('id') id: number) {
    try {
      return await this.addressesService.deleteAddress(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Get('user/:userId')
  @UseGuards(AuthGuard)
  @ApiParam({ name: 'userId', type: Number, description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Returns addresses for the user' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getAddressesByUserId(@Param('userId') userId: number) {
    return await this.addressesService.getAddressesByUserId(userId);
  }

  @Get('user/:userId/default')
  @UseGuards(AuthGuard)
  @ApiParam({ name: 'userId', type: Number, description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the default address for the user',
  })
  @ApiResponse({ status: 404, description: 'Default address not found' })
  async getDefaultAddressByUserId(@Param('userId') userId: number) {
    const defaultAddress =
      await this.addressesService.getDefaultAddressByUserId(userId);
    if (!defaultAddress) {
      throw new NotFoundException('Default address not found');
    }
    return defaultAddress;
  }

  @Post('user/:userId/default/:addressId')
  @UseGuards(AuthGuard)
  @ApiParam({ name: 'userId', type: Number, description: 'User ID' })
  @ApiParam({ name: 'addressId', type: Number, description: 'Address ID' })
  @ApiResponse({ status: 200, description: 'Default address set successfully' })
  @ApiResponse({ status: 404, description: 'Address or user not found' })
  async setDefaultAddress(
    @Param('userId') userId: number,
    @Param('addressId') addressId: number,
  ) {
    try {
      return await this.addressesService.setDefaultAddress(userId, addressId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Delete('user/:userId/default')
  @UseGuards(AuthGuard)
  @ApiParam({ name: 'userId', type: Number, description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Default address removed successfully',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async removeDefaultAddress(@Param('userId') userId: number) {
    try {
      return await this.addressesService.removeDefaultAddress(userId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
