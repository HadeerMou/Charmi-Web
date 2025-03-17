import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UploadedFile,
} from '@nestjs/common';
import prisma from 'src/shared/prisma/client';
import { createProductImagesDto } from './dto/createProductImages.dto';
import { updateProductImagesDto } from './dto/updateProductImages.dto';
import Client from 'ftp';

@Injectable()
export class ProductImagesService {
  async create(
    productImage: createProductImagesDto,
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
    const remoteFilePath = `/public_html/products/${imageFile.originalname}`;
    const exists = await prisma.products.findUnique({
      where: {
        id: productImage.productId,
      },
    });
    if (!exists) {
      throw new NotFoundException('Product not found');
    }
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

      const imagePath = `${process.env.FTP_PATH}${imageFile.originalname}`;

      return await prisma.productImages.create({
        data: {
          isDefault: productImage.isDefault,
          productId: productImage.productId,
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

  async findOne(id: number) {
    const exists = await prisma.productImages.findUnique({
      where: {
        id: id,
      },
    });
    if (!exists) {
      throw new NotFoundException('Product Image not found');
    }
    return await prisma.productImages.findUnique({
      where: {
        id,
      },
    });
  }

  async update(
    id: number,
    updateProductImagesDto: updateProductImagesDto,
    @UploadedFile() imageFile: Express.Multer.File,
  ) {
    const existingImage = await prisma.productImages.findUnique({
      where: { id },
    });

    if (!existingImage) {
      throw new NotFoundException('Product Image not found');
    }

    let imagePath = existingImage.imagePath;

    // Only upload new file if provided
    if (imageFile) {
      const ftpClient = new Client();
      const ftpConfig = {
        host: process.env.FTP_HOST,
        user: process.env.FTP_USER,
        password: process.env.FTP_PASSWORD,
        port: 21,
      };

      // Generate unique filename to avoid overwriting
      const timestamp = Date.now();
      const uniqueFilename = `${timestamp}_${imageFile.originalname}`;
      const remoteFilePath = `/public_html/products/${uniqueFilename}`;

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

        imagePath = `${process.env.FTP_PATH}${uniqueFilename}`;
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException(
          'Failed to upload new file to FTP server',
        );
      }
    }

    return await prisma.productImages.update({
      where: { id },
      data: {
        ...updateProductImagesDto,
        imagePath: imagePath,
      },
    });
  }

  async delete(id: number) {
    const exists = await prisma.productImages.findUnique({
      where: {
        id: id,
      },
    });
    if (!exists) {
      throw new NotFoundException('Product Image not found');
    }
    return await prisma.productImages.update({
      data: {
        deletedAt: new Date(),
      },
      where: {
        id: id,
      },
    });
  }

  async findAll(id: number) {
    const exists = await prisma.products.findUnique({
      where: {
        id: id,
      },
    });
    if (!exists) {
      throw new NotFoundException('Product not found');
    }
    return prisma.productImages.findMany({
      where: {
        productId: id,
        deletedAt: null,
      },
    });
  }
}
