import { Controller, Get, Param } from '@nestjs/common';
import { DistrictService } from './district.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('district')
@ApiTags('district')
export class DistrictController {
  constructor(private districtService: DistrictService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Fetch one district by its id' })
  async getOneById(@Param('id') id: string) {
    return await this.districtService.getOneById(id);
  }

  @Get('by-city/:cityId')
  @ApiOperation({ summary: 'Fetch all districts by their city id' })
  async getAllByCityId(@Param('cityId') cityId: string) {
    return await this.districtService.getAllByCityId(+cityId);
  }
}
