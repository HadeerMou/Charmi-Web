import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpStatus,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ShippingFeesService } from './shipping-fees.service';
import {
  CreateShippingFeeDto,
  createShippingFeeSchema,
} from './dto/shippingFees.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { JoiValidationPipe } from 'src/shared/utils/joiValidations';

@ApiTags('shipping-fees')
@Controller('shipping-fees')
export class ShippingFeesController {
  constructor(private readonly shippingFeesService: ShippingFeesService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post()
  @ApiBody({ type: CreateShippingFeeDto })
  @UsePipes(new JoiValidationPipe(createShippingFeeSchema))
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: CreateShippingFeeDto,
  })
  async create(@Body() createShippingFeeDto: CreateShippingFeeDto) {
    const data = await this.shippingFeesService.create(createShippingFeeDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Shipping Fee created successfully',
      data,
    };
  }

  @Get()
  async findAll() {
    const data = await this.shippingFeesService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Shipping Fees fetched successfully',
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.shippingFeesService.findOne(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Shipping Fee fetched successfully',
      data,
    };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Put(':id')
  @ApiBody({ type: CreateShippingFeeDto })
  async update(
    @Param('id') id: string,
    @Body(new JoiValidationPipe(createShippingFeeSchema))
    shippingFee: CreateShippingFeeDto,
  ) {
    const data = await this.shippingFeesService.update(+id, shippingFee);
    return {
      statusCode: HttpStatus.OK,
      message: 'Shipping Fee updated successfully',
      data,
    };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.shippingFeesService.delete(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Shipping Fee deleted successfully',
    };
  }
}
