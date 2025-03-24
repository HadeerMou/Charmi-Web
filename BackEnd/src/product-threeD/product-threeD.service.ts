import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UploadedFile,
} from '@nestjs/common';
import prisma from 'src/shared/prisma/client';
import { createProduct3DDto } from './dto/createProduct3D.dto';
import { updateProduct3DDto } from './dto/updateProduct3D.dto';
import Client from 'ftp';

@Injectable()
export class Product3DService {
  private async uploadToFTP(file: Express.Multer.File, remoteFilePath: string) {
    const ftpClient = new Client();
    const ftpConfig = {
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
      port: 21,
    };

    return new Promise<void>((resolve, reject) => {
      ftpClient.on('ready', () => {
        console.log(`📡 FTP Connected. Uploading file to: ${remoteFilePath}`);
        ftpClient.put(file.buffer, remoteFilePath, (err) => {
          ftpClient.end();
          if (err) {
            console.error('❌ FTP Upload Failed:', err);
            reject(err);
          } else {
            console.log('✅ FTP Upload Successful:', remoteFilePath);
            resolve();
          }
        });
      });

      ftpClient.on('error', (err) => {
        console.error('❌ FTP Connection Error:', err);
        reject(err);
        ftpClient.end();
      });
      ftpClient.connect(ftpConfig);
    });
  }

  async create(
    productModel: createProduct3DDto,
    modelFile: Express.Multer.File,
  ) {
    console.log('📥 Received data:', productModel);
    console.log('📂 Received file:', modelFile?.originalname);
    if (!modelFile) {
      console.error('❌ No file uploaded');

      throw new BadRequestException('No file uploaded');
    }

    const productExists = await prisma.products.findUnique({
      where: { id: productModel.productId },
    });

    if (!productExists) {
      throw new NotFoundException('Product not found');
    }

    // Generate unique filename
    const uniqueFilename = `${Date.now()}_${modelFile.originalname}`;
    const remoteFilePath = `/public_html/products/${uniqueFilename}`;

    try {
      await this.uploadToFTP(modelFile, remoteFilePath);
      const modelPath = `${process.env.FTP_PATH}${uniqueFilename}`;
      console.log(`✅ Model uploaded to: ${modelPath}`); // Debugging log
      const existingModel = await prisma.productModel.findUnique({
        where: { productId: productModel.productId },
      });

      if (existingModel) {
        console.log('♻️ Updating existing model with new path:', modelPath);
        // Update existing model
        return await prisma.productModel.update({
          where: { productId: productModel.productId },
          data: { modelPath },
        });
      }
      console.log('🆕 Creating new model with path:', modelPath);
      // Create new model if not exists
      const savedModel = await prisma.productModel.create({
        data: {
          productId: productModel.productId,
          modelPath,
        },
      });
      console.log('✅ 3D Model saved successfully:', savedModel);
    } catch (error) {
      console.error('❌ Error uploading or saving:', error);
      console.error(error);
      throw new InternalServerErrorException(
        'Failed to upload file to FTP server',
      );
    }
  }
  async findOne(id: number) {
    console.log(`🔍 Searching for 3D model with ID: ${id}`);

    const model = await prisma.productModel.findUnique({
      where: { productId: id },
    });

    if (!model) {
      console.log(`⚠️ No 3D model found.`);
      return null; // ✅ Return null instead of throwing an error
    }

    const modelUrl = model.modelPath.startsWith('http')
      ? model.modelPath
      : `${process.env.FTP_BASE_URL}/${model.modelPath}`;

    console.log(`✅ Returning model URL: ${modelUrl}`);

    return { modelUrl };
  }

  async update(
    id: number,
    updateProduct3DDto: updateProduct3DDto,
    @UploadedFile() modelFile?: Express.Multer.File,
  ) {
    const existingModel = await prisma.productModel.findUnique({
      where: { productId: id },
    });

    if (!existingModel) {
      throw new NotFoundException('3D Model not found for this product');
    }

    let modelPath = existingModel.modelPath;

    if (modelFile) {
      const uniqueFilename = `${Date.now()}_${modelFile.originalname}`;
      const remoteFilePath = `/public_html/products/${uniqueFilename}`;

      try {
        await this.uploadToFTP(modelFile, remoteFilePath);
        modelPath = `${process.env.FTP_PATH}${uniqueFilename}`;
        console.log(`✅ Updated model path: ${modelPath}`);
      } catch (error) {
        console.error(error);
        throw new InternalServerErrorException(
          'Failed to upload new file to FTP server',
        );
      }
    }
    console.log('♻️ Updating modelPath in DB:', modelPath);

    return await prisma.productModel.update({
      where: { productId: id },
      data: {
        ...updateProduct3DDto,
        modelPath,
      },
    });
  }

  async delete(id: number) {
    const exists = await prisma.productModel.findUnique({
      where: { productId: id },
    });

    if (!exists) {
      throw new NotFoundException('3D Model not found for this product');
    }

    return await prisma.productModel.update({
      where: { productId: id },
      data: { deletedAt: new Date() },
    });
  }

  async findAll(productId: number) {
    console.log(`🔍 Fetching models for product ID: ${productId}`);

    const productExists = await prisma.products.findUnique({
      where: { id: productId },
    });

    if (!productExists) {
      throw new NotFoundException('Product not found');
    }

    const model = await prisma.productModel.findUnique({
      where: { productId, deletedAt: null },
    });

    if (!model) {
      throw new NotFoundException('No model found for this product.');
    }

    return model;
  }

  async createIfNotExists(productId: number, modelFile: Express.Multer.File) {
    console.log(
      `⚠️ No existing model found. Creating a new one for product ID: ${productId}...`,
    );

    if (!modelFile) {
      throw new BadRequestException(
        'No model file provided. Cannot create a new model.',
      );
    }

    try {
      // Upload the model file to FTP
      const uniqueFilename = `${Date.now()}_${modelFile.originalname}`;
      const remoteFilePath = `/public_html/products/${uniqueFilename}`;
      await this.uploadToFTP(modelFile, remoteFilePath);
      const modelPath = `${process.env.FTP_PATH}${uniqueFilename}`;

      console.log(`✅ Model uploaded to: ${modelPath}`);

      // Create the model in the database
      const newModel = await prisma.productModel.create({
        data: {
          productId,
          modelPath,
        },
      });

      console.log(`✅ New model created successfully:`, newModel);
      return newModel;
    } catch (error) {
      console.error('❌ Error uploading or saving:', error);
      throw new InternalServerErrorException(
        'Failed to upload file or save model.',
      );
    }
  }
}
