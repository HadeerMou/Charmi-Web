import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Body } from '@nestjs/common';
import { CategoryService } from './category.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Role } from 'src/shared/enums/role.enum';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('category')
@ApiBearerAuth()
@Controller('category')
export class CategoryController {
  constructor(protected readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: 'Create Category' })
  @ApiConsumes('multipart/form-data')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('imageFile'))
  @ApiBody({ type: CreateCategoryDto })
  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() imageFile: Express.Multer.File,
  ) {
    return await this.categoryService.create(createCategoryDto, imageFile);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.categoryService.findOne(+id);
  }

  @Get()
  async findAll() {
    return await this.categoryService.findAll();
  }

  @ApiParam({ name: 'id', required: true })
  @ApiBody({
    schema: { type: 'object', properties: { name: { type: 'string' } } },
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: { name: string }) {
    return await this.categoryService.update(+id, body.name);
  }

  @ApiParam({ name: 'id', required: true })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiParam({ name: 'id', required: true })
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.categoryService.delete(+id);
  }
}
