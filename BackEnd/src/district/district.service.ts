import { Injectable } from '@nestjs/common';
import prisma from 'src/shared/prisma/client';

@Injectable()
export class DistrictService {
  async getOneById(districtId: string) {
    return await prisma.district.findUnique({
      where: { district_id: districtId },
    });
  }

  async getAllByCityId(cityId: number) {
    return await prisma.district.findMany({
      where: { cityId: cityId },
      select: {
        district_id: true,
        districtName: true,
        districtOtherName: true,
        cityId: true,
      },
    });
  }
}
