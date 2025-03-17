import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UploadedFile,
} from '@nestjs/common';
import prisma from 'src/shared/prisma/client';
import { CreateCategoryDto } from './dto/createCategory.dto';
import Client from 'ftp';

@Injectable()
export class CategoryService {
  async create(
    categoryDto: CreateCategoryDto,
    @UploadedFile() imageFile: Express.Multer.File,
  ) {
    if (!imageFile) {
      throw new BadRequestException('No file uploaded');
    }

    const ftpClient = new Client();
    const ftpConfig = {
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
      port: 21,
    };
    const remoteFilePath = `/public_html/category/${imageFile.originalname}`;

    try {
      await new Promise((resolve, reject) => {
        ftpClient.on('ready', () => {
          ftpClient.put(imageFile.buffer, remoteFilePath, (err) => {
            if (err) {
              reject(err);
            } else {
              resolve(null);
            }
            ftpClient.end();
          });
        });

        ftpClient.on('error', (err) => {
          reject(err);
        });

        ftpClient.connect(ftpConfig);
      });

      const imagePath = `${process.env.FTP_PATH_C}${imageFile.originalname}`;

      return await prisma.category.create({
        data: {
          name: categoryDto.name,
          imagePath: imagePath,
        },
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Failed to upload file to FTP server',
      );
    }
  }

  async findAll() {
    return await prisma.category.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        products: true,
      },
    });
  }

  async update(id: number, name: string) {
    const category = await prisma.category.update({
      where: {
        id: id,
      },
      data: {
        name,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async delete(id: number) {
    const category = await prisma.category.update({
      where: {
        id: id,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async findOne(id: number) {
    const category = await prisma.category.findUnique({
      where: {
        id: id,
      },
      include: {
        products: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }
}
