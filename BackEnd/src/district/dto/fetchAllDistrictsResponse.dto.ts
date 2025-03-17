import { ApiProperty } from '@nestjs/swagger';

export class fetchAllDistrictsResponse {
  @ApiProperty()
  district_id: string;
  @ApiProperty()
  city_id: number;
  @ApiProperty()
  district_name: string;
  @ApiProperty()
  district_other_name: string;
}
