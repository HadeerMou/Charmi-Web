import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { createProductDto, createProductSchema } from './dto/createProduct.dto';
import { ProductsService } from './products.service';
import { updateProductDto, updateProductSchema } from './dto/updateProduct.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { JoiValidationPipe } from 'src/shared/utils/joiValidations';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Role } from 'src/shared/enums/role.enum';
import { Roles } from 'src/shared/decorators/roles.decorator';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiBody({ type: createProductDto })
  @UsePipes(new JoiValidationPipe(createProductSchema))
  @Post()
  async create(@Body() product: createProductDto) {
    return await this.productsService.create(product);
  }

  @ApiBody({
    schema: { type: 'object', properties: { id: { type: 'number' } } },
  })
  @ApiOperation({ summary: 'Get product by id' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.productsService.findOne(+id);
  }

  @ApiOperation({ summary: 'Get all products' })
  @ApiBearerAuth()
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiBody({ type: updateProductDto })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(new JoiValidationPipe(updateProductSchema)) product: updateProductDto,
  ) {
    return await this.productsService.update(+id, product);
  }

  @ApiBody({
    schema: { type: 'object', properties: { id: { type: 'number' } } },
  })
  @ApiOperation({ summary: 'Delete product by id' })
  @ApiBearerAuth()
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.productsService.delete(+id);
  }

  @ApiOperation({ summary: 'Get all products' })
  @Get()
  async findAll() {
    return await this.productsService.findAll();
  }
}
