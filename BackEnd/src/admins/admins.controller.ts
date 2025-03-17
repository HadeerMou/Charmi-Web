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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminsService } from './admins.service';
import { CreateAdminDto, CreateAdminSchema } from './dto/createAdmin.dto';
import { updateAdminDto, updateAdminSchema } from './dto/updateAdmin.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { User } from 'src/shared/decorators/user.decorator';
import { Payload } from 'src/types';
import { JoiValidationPipe } from 'src/shared/utils/joiValidations';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('admins')
export class AdminsController {
  constructor(private readonly adminService: AdminsService) {}

  @ApiOperation({ summary: 'Get Admin Profie' })
  @Get('profile')
  async getProfile(@User() user: Payload) {
    return await this.adminService.getProfile(user.sub);
  }

  @ApiOperation({ summary: 'Create Admin' })
  @UsePipes(new JoiValidationPipe(CreateAdminSchema))
  @Post()
  async create(@Body() admin: CreateAdminDto) {
    return await this.adminService.create(admin);
  }

  @ApiOperation({ summary: 'Get All Admins' })
  @Get()
  async findAll() {
    return await this.adminService.findAll();
  }

  @ApiOperation({ summary: 'Find Admin by Id' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.adminService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update Admin' })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(new JoiValidationPipe(updateAdminSchema))
    updateAdminDto: updateAdminDto,
  ) {
    return await this.adminService.update(+id, updateAdminDto);
  }

  @ApiOperation({ summary: 'Delete Admin' })
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.adminService.delete(+id);
  }
}
