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
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CountryService } from './country.service';
import { CreateCountryDto, createCountrySchema } from './dto/createCountry.dto';
import { JoiValidationPipe } from 'src/shared/utils/joiValidations';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Role } from 'src/shared/enums/role.enum';
import { Roles } from 'src/shared/decorators/roles.decorator';
@ApiTags('Country')
@ApiBearerAuth()
@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @UsePipes(new JoiValidationPipe(createCountrySchema))
  async create(@Body() createCountryDto: CreateCountryDto): Promise<any> {
    return await this.countryService.create(createCountryDto);
  }

  @Get()
  async findAll(): Promise<any> {
    return await this.countryService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    return await this.countryService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiBody({ type: CreateCountryDto })
  async update(
    @Param('id') id: string,
    @Body(new JoiValidationPipe(createCountrySchema))
    createCountryDto: CreateCountryDto,
  ): Promise<any> {
    return await this.countryService.update(+id, createCountryDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully deleted',
  })
  async delete(@Param('id') id: string): Promise<any> {
    return await this.countryService.remove(+id);
  }
}
