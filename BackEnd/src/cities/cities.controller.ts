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
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { CitiesService } from './cities.service';
import { CreateCityDto, createCitySchema } from './dto/createCity.dto';
import { JoiValidationPipe } from 'src/shared/utils/joiValidations';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { Role } from 'src/shared/enums/role.enum';

@ApiTags('cities')
@ApiBearerAuth()
@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiBody({ type: CreateCityDto })
  @UsePipes(new JoiValidationPipe(createCitySchema))
  @Post()
  async create(@Body() createCityDto: CreateCityDto) {
    return await this.citiesService.create(createCityDto);
  }

  @Get()
  async findAll() {
    return await this.citiesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.citiesService.findOne(+id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiBody({ type: CreateCityDto })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(new JoiValidationPipe(createCitySchema)) updateCityDto: CreateCityDto,
  ) {
    return await this.citiesService.update(+id, updateCityDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.citiesService.remove(+id);
  }
}
