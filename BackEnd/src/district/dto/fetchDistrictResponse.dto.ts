import { ApiProperty } from '@nestjs/swagger';

export class fetchDistrictResponse {
  @ApiProperty()
  district_id: string;
  @ApiProperty()
  zone_id: string;
  @ApiProperty()
  zone_name: string;
  @ApiProperty()
  zone_other_name: string;
  @ApiProperty()
  district_name: string;
  @ApiProperty()
  district_other_name: string;
  @ApiProperty()
  pickup_availability: boolean;
  @ApiProperty()
  drop_off_availability: boolean;
  @ApiProperty()
  city_id: number;
}
