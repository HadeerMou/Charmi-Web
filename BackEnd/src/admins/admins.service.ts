import {
  BadRequestException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/createAdmin.dto';
import { updateAdminDto } from './dto/updateAdmin.dto';
import prisma from 'src/shared/prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminsService {
  async getProfile(userId: number) {
    return await prisma.admins.findUnique({
      where: {
        id: userId,
      },
    });
  }

  async create(admin: CreateAdminDto) {
    const existingUser = await prisma.admins.findUnique({
      where: {
        email: admin.email,
      },
    });
    if (existingUser && existingUser.deletedAt) {
      throw new BadRequestException('Account is Deleted');
    }

    if (existingUser) {
      throw new BadRequestException('Admin already exists');
    }

    admin.password = await bcrypt.hash(admin.password, 10);

    return await prisma.admins.create({
      data: {
        ...admin,
      },
    });
  }

  async findAll() {
    return await prisma.admins.findMany({
      where: {
        deletedAt: null,
      },
    });
  }

  async findOne(id: number) {
    return await prisma.admins.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateAdminDto: updateAdminDto) {
    const exists = await prisma.admins.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException('Admin does not exist');
    }
    exists.password = await bcrypt.hash(updateAdminDto.password, 10);
    return await prisma.admins.update({
      where: {
        id,
      },
      data: {
        ...updateAdminDto,
      },
    });
  }

  async delete(id: number) {
    const adminToDelete = await prisma.admins.findUnique({ where: { id } });
    if (adminToDelete) {
      return await prisma.admins.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    }
    throw new NotFoundException('Admin not found');
  }
}
