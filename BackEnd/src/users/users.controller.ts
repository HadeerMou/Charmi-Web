import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { CreateUserDto, createUserSchema } from './dto/createUser.dto';
import { UsersService } from './users.service';
import { UpdateUserDto, updateUserSchema } from './dto/updateUser.dto';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { User } from 'src/shared/decorators/user.decorator';
import { Payload } from 'src/types';
import { JoiValidationPipe } from 'src/shared/utils/joiValidations';
@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get user profile' })
  @Get('/profile')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.User)
  async profile(@User() user: Payload): Promise<any> {
    const foundUser = await this.usersService.findUserProfileById(+user.sub);
    return {
      message: 'User fetched successfully',
      data: foundUser,
    };
  }

  @ApiOperation({ summary: 'Delete user profile' })
  @Delete('/profile')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.User)
  async deleteProfile(@User() user: Payload): Promise<any> {
    await this.usersService.delete(+user.sub);
    return {
      message: 'User deleted successfully',
    };
  }

  @ApiOperation({ summary: 'Get all users' })
  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async findAll(): Promise<any> {
    const data = await this.usersService.findAll();
    return {
      message: 'Users fetched successfully',
      data: data,
    };
  }

  @ApiOperation({ summary: 'Create user' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post('/')
  @UsePipes(new JoiValidationPipe(createUserSchema))
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: User,
  })
  async create(@Body() user: CreateUserDto): Promise<any> {
    return await this.usersService.create(user);
  }

  @ApiOperation({ summary: 'Update user' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Put(':id')
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: User,
  })
  @ApiParam({ name: 'id', type: String, description: 'User ID' })
  @ApiBody({ type: UpdateUserDto })
  async update(
    @Param('id') id: string,
    @Body(new JoiValidationPipe(updateUserSchema)) user: UpdateUserDto,
  ): Promise<any> {
    return await this.usersService.update(+id, user);
  }

  @ApiOperation({ summary: 'Update user profile' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.User)
  @Patch('Profile')
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: User,
  })
  @Put()
  async updateProfile(id: string, @Body() user: UpdateUserDto): Promise<any> {
    return await this.usersService.update(+id, user);
  }

  @ApiOperation({ summary: 'Delete user' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiParam({ name: 'id', type: String, description: 'User Id' })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<any> {
    return await this.usersService.delete(+id);
  }

  @ApiOperation({ summary: 'Get user by id' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    return await this.usersService.findOne(id);
  }
}
