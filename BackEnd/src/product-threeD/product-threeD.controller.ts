import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  // UsePipes,
} from '@nestjs/common';
import {
  createProduct3DDto,
  // createProductImagesSchema,
} from './dto/createProduct3D.dto';
import { Product3DService } from './product-threeD.service';
import { updateProduct3DDto } from './dto/updateProduct3D.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Role } from 'src/shared/enums/role.enum';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Product 3D Models') // Improves Swagger categorization
@Controller('product-model')
export class Product3DController {
  constructor(private readonly product3DService: Product3DService) {}

  @ApiOperation({ summary: 'Create product Model' })
  @ApiConsumes('multipart/form-data')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiBody({ type: createProduct3DDto })
  @UseInterceptors(FileInterceptor('modelFile'))
  @ApiBearerAuth()
  @Post()
  async create(
    @Body() productModel: createProduct3DDto,
    @UploadedFile() modelFile: Express.Multer.File,
  ) {
    productModel.productId = Number(productModel.productId);
    if (!modelFile) {
      throw new BadRequestException('No model file provided.');
    }
    const existingModel = await this.product3DService.findOne(
      productModel.productId,
    );
    if (existingModel) {
      throw new BadRequestException(
        'A 3D model already exists for this product. Update the existing model instead.',
      );
    }
    return await this.product3DService.create(productModel, modelFile);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.product3DService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update product Model' })
  @ApiConsumes('multipart/form-data')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiBody({ type: updateProduct3DDto })
  @UseInterceptors(FileInterceptor('modelFile'))
  @ApiBearerAuth()
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProduct3DDto: updateProduct3DDto,
    @UploadedFile() modelFile: Express.Multer.File,
  ) {
    return await this.product3DService.update(
      +id,
      updateProduct3DDto,
      modelFile,
    );
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async delete(@Param('id') id: string) {
    return await this.product3DService.delete(+id);
  }

  @Get('product/:productId')
  async findAll(@Param('productId') productId: string) {
    return await this.product3DService.findAll(+productId);
  }
}
