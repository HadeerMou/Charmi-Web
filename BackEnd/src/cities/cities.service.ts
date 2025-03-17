import { Injectable } from '@nestjs/common';
import { CreateCityDto } from './dto/createCity.dto';
import prisma from 'src/shared/prisma/client';
@Injectable()
export class CitiesService {
  async create(createCityDto: CreateCityDto) {
    return await prisma.cities.create({
      data: {
        ...createCityDto,
      },
    });
  }

  async findAll() {
    return await prisma.cities.findMany({
      where: {
        deletedAt: null,
      },
    });
  }

  async findOne(id: number) {
    const city = await prisma.cities.findUnique({
      where: {
        id,
      },
    });
    if (city) {
      return city;
    }
    throw new Error('City not found');
  }

  async update(id: number, updateCityDto: CreateCityDto) {
    const city = await prisma.cities.findUnique({
      where: {
        id,
      },
    });
    if (city) {
      return await prisma.cities.update({
        where: {
          id,
        },
        data: {
          ...updateCityDto,
        },
      });
    }
    throw new Error('City not found');
  }

  async remove(id: number) {
    const city = await prisma.cities.findUnique({
      where: {
        id,
      },
    });
    if (city) {
      return await prisma.cities.update({
        where: {
          id,
        },
        data: {
          deletedAt: new Date(),
        },
      });
    }
    throw new Error('City not found');
  }
}
