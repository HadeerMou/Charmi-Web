import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import prisma from 'src/shared/prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/shared/enums/role.enum';
import { UsersService } from 'src/users/users.service';
import { AdminsService } from 'src/admins/admins.service';
import { Payload } from 'src/types';
import { Users, Admins } from '@prisma/client';
import Verification from 'src/shared/utils/verfication/Verification';
import { ResetPasswordDTO } from './dto/resetPassword.dto';
import { CreateUserDto } from 'src/users/dto/createUser.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
    private adminService: AdminsService,
    private verficationProvider: Verification,
  ) {}

  async login(email: string, password: string, userType: string) {
    let user: Users | Admins | null = null;
    if (userType === Role.User.toString()) {
      user = await prisma.users.findUnique({
        where: {
          email: email,
        },
      });
    } else if (userType === Role.Admin.toString()) {
      user = await prisma.admins.findUnique({
        where: {
          email: email,
        },
      });
    }

    if (user === null) throw new NotFoundException('Invalid email or password');

    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) throw new NotFoundException('Invalid email or password');

    if (user.deletedAt) throw new NotFoundException('User is deleted');

    const payload: Payload = {
      sub: user.id,
      role: userType,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
    };
  }

  async signUp(user: Record<string, any>, userType: string) {
    if (userType === Role.User.toString()) {
      const existingUser = await this.userService.findOne(user.email);
      if (existingUser) {
        throw new BadRequestException('Email is already registered');
      }

      // Send OTP for verification
      await this.sendVerficationOtp(user.email, userType);

      return {
        message: 'Verification OTP sent. Please verify to complete signup.',
      };
    }
  }

  async sendVerficationOtp(input: string, userType: string) {
    await this.verficationProvider.sendVerificationCode(input, userType);
  }

  async isOtpValid(input: string, userType: string, otp: string) {
    const isValid = await this.verficationProvider.verify(input, otp, userType);
    if (isValid) {
      return {
        isValid,
      };
    } else {
      throw new BadRequestException('Invalid OTP');
    }
  }

  async verifyOtp(userData: CreateUserDto, otp: string, userType: string) {
    // Ensure userData contains all required fields
    if (
      !userData.email ||
      !userData.username ||
      !userData.phone ||
      !userData.password
    ) {
      throw new BadRequestException('Missing required fields');
    }

    const { email, username, phone, password } = userData;

    // Verify OTP
    const isValid = await this.verficationProvider.verify(email, otp, userType);
    if (!isValid) {
      throw new BadRequestException('Invalid OTP');
    }

    // Check if the user already exists
    const existingUser = await this.userService.findOne(email);
    if (existingUser) {
      throw new BadRequestException('User is already verified and registered');
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user with real input values
    const newUser = await this.userService.create({
      email: email,
      username: username,
      phone: phone,
      password: hashedPassword,
    });

    return {
      message: 'OTP verified successfully, account created',
      user: newUser,
    };
  }

  public async forgetPassword(email: string, userType: string) {
    if (userType == 'USER') {
      await this.userService.findOne(email);
    }
    await this.verficationProvider.sendVerificationCodeForget(email, userType);
  }

  public async resetPassword(data: ResetPasswordDTO, userType: string) {
    if (userType == 'USER') {
      const user = await this.userService.findOne(data.email);
      if (!user) throw new NotFoundException('User not found');
      const isTheSame = await bcrypt.compare(data.newPassword, user.password);
      if (isTheSame) {
        throw new BadRequestException(
          'New password cannot be same as old password',
        );
      }
      await this.verifyOtp(
        {
          email: data.email,
          username: user.username, // Retrieve from user
          phone: user.phone, // Retrieve from user
          password: user.password, // Retrieve from user (or require input)
        },
        data.otp,
        userType,
      );
      const hashedPassword = await bcrypt.hash(data.newPassword, 10);
      await this.userService.updateUserPassword(user.id, hashedPassword);
    }
  }
}
