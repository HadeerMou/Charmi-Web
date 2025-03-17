import { Injectable } from '@nestjs/common';
import { CreateCountryDto } from './dto/createCountry.dto';
import prisma from 'src/shared/prisma/client';
@Injectable()
export class CountryService {
  async create(createCountryDto: CreateCountryDto): Promise<any> {
    return await prisma.countries.create({
      data: {
        name: createCountryDto.name,
      },
    });
  }

  async findAll(): Promise<any> {
    return await prisma.countries.findMany({
      where: {
        deletedAt: null,
      },
    });
  }

  async findOne(id: number) {
    return await prisma.countries.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateCountryDto: CreateCountryDto) {
    return await prisma.countries.update({
      where: {
        id,
      },
      data: {
        name: updateCountryDto.name,
      },
    });
  }

  async remove(id: number) {
    return await prisma.countries.delete({
      where: {
        id,
      },
    });
  }
}
