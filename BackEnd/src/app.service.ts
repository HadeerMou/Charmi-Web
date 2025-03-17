import { Injectable } from '@nestjs/common';
import prisma from './shared/prisma/client';
import countriesData from './data/countries.json';
import citiesData from './data/cities.json';
import * as bcrypt from 'bcrypt';

interface CountryData {
  id: number;
  governorate_name_en: string;
}

interface DistrictData {
  districtId: string;
  zoneId: string;
  zoneName: string;
  zoneOtherName: string;
  districtName: string;
  districtOtherName: string;
  pickupAvailability: boolean;
  dropOffAvailability: boolean;
}

interface CityData {
  id: number;
  cityName: string;
  cityCode: string;
  districts: DistrictData[];
}

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async onApplicationBootstrap(): Promise<void> {
    await this.seedData();
  }

  private async seedData(): Promise<void> {
    await this.seedCountries();
    await this.seedCities();
    await this.seedSuperAdmin();
  }

  private async seedSuperAdmin(): Promise<void> {
    const Admins = await prisma.admins.findFirst();
    if (!Admins) {
      const hashedPassword = await bcrypt.hash(
        process.env.ADMIN_PASSWORD || '',
        10,
      );
      await prisma.admins.create({
        data: {
          email: process.env.ADMIN_MAIL || '',
          password: hashedPassword || '',
        },
      });
    }
  }

  private async seedCountries(): Promise<void> {
    const countries = await prisma.countries.findFirst();

    if (!countries) {
      const typedCountriesData = countriesData as CountryData[];

      await Promise.all(
        typedCountriesData.map(async (country) => {
          await prisma.countries.create({
            data: {
              id: country.id,
              name: country.governorate_name_en,
            },
          });
        }),
      );
    }
  }

  private async seedCities(): Promise<void> {
    const cities = await prisma.cities.findFirst();

    if (!cities) {
      const typedCitiesData = citiesData as CityData[];

      await Promise.all(
        typedCitiesData.map(async (city) => {
          await prisma.cities.create({
            data: {
              id: city.id,
              name: city.cityName,
              code: city.cityCode,
              countryId: 1,
              Districts: {
                createMany: {
                  data: city.districts.map((district) => ({
                    district_id: district.districtId,
                    zoneId: district.zoneId,
                    zoneName: district.zoneName,
                    zoneOtherName: district.zoneOtherName,
                    districtName: district.districtName,
                    districtOtherName: district.districtOtherName,
                    pickupAvailability: district.pickupAvailability,
                    dropOffAvailability: district.dropOffAvailability,
                  })),
                },
              },
            },
          });
        }),
      );
    }
  }
}
