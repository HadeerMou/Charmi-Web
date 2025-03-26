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
      if (!(await this.userService.isVerified(user.email))) {
        throw new BadRequestException('Email is not verified');
      }
      return await this.userService.create(user as any);
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

  async verifyOtp(input: string, otp: string, userType: string) {
    const isValid = await this.verficationProvider.verify(input, otp, userType);
    if (!isValid) {
      throw new BadRequestException('Invalid OTP');
    }
    return { message: 'OTP verified successfully' };
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
      await this.verifyOtp(data.email, data.otp, userType);
      const hashedPassword = await bcrypt.hash(data.newPassword, 10);
      await this.userService.updateUserPassword(user.id, hashedPassword);
    }
  }
}
