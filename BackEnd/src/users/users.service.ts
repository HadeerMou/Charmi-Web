import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import prisma from 'src/shared/prisma/client';
import { CreateUserDto } from './dto/createUser.dto';
import { Users } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UsersService {
  async create(user: CreateUserDto) {
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [
          { email: user.email },
          { username: user.username },
          { phone: user.phone },
        ],
      },
    });

    if (existingUser) {
      if (existingUser.email === user.email) {
        throw new BadRequestException('Email already exists');
      }
      if (existingUser.username === user.username) {
        throw new BadRequestException('Username already exists');
      }
      if (existingUser.phone === user.phone) {
        throw new BadRequestException('Phone number already exists');
      }
    }

    user.password = await bcrypt.hash(user.password, 10);

    return await prisma.users.create({
      data: {
        ...user,
        carts: {
          create: {},
        },
      },
    });
  }

  async update(id: number, user: UpdateUserDto): Promise<any> {
    const userToUpdate = await prisma.users.findUnique({ where: { id } });
    if (!userToUpdate) {
      throw new NotFoundException('User not found');
    }

    return await prisma.users.update({
      data: {
        ...user,
      },
      where: {
        id: id,
      },
    });
  }

  async delete(id: number) {
    const user = await prisma.users.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('user does not exist');
    }

    await prisma.users.update({
      data: {
        deletedAt: new Date(),
      },
      where: {
        id,
      },
    });
  }

  async updateUserPassword(id: number, password: string): Promise<any> {
    return await prisma.users.update({ where: { id }, data: { password } });
  }

  async findOne(email: string) {
    const user = await prisma.users.findUnique({ where: { email } });
    if (user && !user.deletedAt) {
      return user;
    }
    throw new NotFoundException(`ْUser with email ${email} not found`);
  }

  async findAll(): Promise<Users[]> {
    return await prisma.users.findMany({
      where: {
        deletedAt: null,
      },
    });
  }

  async findUserById(id: number) {
    return await prisma.users.findUnique({
      where: { id },
      include: {
        UserAddresses: {
          include: {
            Addresses: {
              include: {
                City: {
                  include: {
                    Countries: true,
                  },
                },
              },
            },
          },
        },
        orders: true,
      },
    });
  }

  async findUserProfileById(id: number) {
    const user = await prisma.users.findUnique({
      where: { id },
      include: {
        carts: true,
        orders: true,
      },
    });
    return user;
  }

  async isVerified(input: string): Promise<boolean> {
    const otpCodes = await prisma.otpCodes.findFirst({
      where: {
        input,
        userType: 'USER',
      },
    });
    if (!otpCodes) return false;
    return otpCodes.isVerified;
  }
}
