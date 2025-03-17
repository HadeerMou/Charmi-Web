import {
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
  createProductImagesDto,
  // createProductImagesSchema,
} from './dto/createProductImages.dto';
import { ProductImagesService } from './product-images.service';
import { updateProductImagesDto } from './dto/updateProductImages.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Role } from 'src/shared/enums/role.enum';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('product-images')
export class ProductImagesController {
  constructor(private readonly productImagesService: ProductImagesService) {}

  @ApiOperation({ summary: 'Create product images' })
  @ApiConsumes('multipart/form-data')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  // @UsePipes(new JoiValidationPipe(createProductImagesSchema))
  @ApiBody({ type: createProductImagesDto })
  @UseInterceptors(FileInterceptor('imageFile'))
  @ApiBearerAuth()
  @Post()
  async create(
    @Body() productImage: createProductImagesDto,
    @UploadedFile() imageFile: Express.Multer.File,
  ) {
    if (typeof productImage.isDefault !== 'boolean') {
      productImage.isDefault = productImage.isDefault === 'true';
    }
    productImage.productId = Number(productImage.productId);
    return await this.productImagesService.create(productImage, imageFile);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.productImagesService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update product images' })
  @ApiConsumes('multipart/form-data')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiBody({ type: updateProductImagesDto })
  @UseInterceptors(FileInterceptor('imageFile'))
  @ApiBearerAuth()
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductImagesDto: updateProductImagesDto,
    @UploadedFile() imageFile: Express.Multer.File,
  ) {
    if (typeof updateProductImagesDto.isDefault !== 'boolean') {
      updateProductImagesDto.isDefault =
        updateProductImagesDto.isDefault === 'true';
    }
    return await this.productImagesService.update(
      +id,
      updateProductImagesDto,
      imageFile,
    );
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async delete(@Param('id') id: string) {
    return await this.productImagesService.delete(+id);
  }

  @Get('product/:productId')
  async findAll(@Param('productId') productId: string) {
    return await this.productImagesService.findAll(+productId);
  }
}
