import { Injectable } from '@nestjs/common';
import NodeMailerRepository from '../email/NodeMailerRepository';
import VerificationCodeGenerator from '../code-generator/VerificationCodeGenerator';
import { MailService } from 'src/mail/mail.service';
import { joiValidator } from '../joi/joiValidator';
import prisma from 'src/shared/prisma/client';
import moment from 'moment';
import Joi from 'joi';

@Injectable()
export default class Verification {
  private readonly emailProvider: NodeMailerRepository;
  private readonly verificationCodeGenerator: VerificationCodeGenerator;

  constructor(private mailService: MailService) {
    this.emailProvider = new NodeMailerRepository(this.mailService);
    this.verificationCodeGenerator = new VerificationCodeGenerator();
  }

  async verify(
    emailOrPhone: string,
    code: string,
    userType: string,
  ): Promise<boolean> {
    return this.isOtpValidForEmail(emailOrPhone, code, userType);
  }

  async sendVerificationCode(email: string, userType: string): Promise<void> {
    await this.sendEmailVerificationCode(email, userType);
  }

  private async generateCode(): Promise<{ code: string; hashedCode: string }> {
    const code = this.verificationCodeGenerator.generateCode();
    const hashedCode = this.verificationCodeGenerator.hash(code);
    return Promise.resolve({ code, hashedCode });
  }

  private async setOtpUserCode(
    input: string,
    userType: string,
    hashedCode: string,
  ) {
    const userCode = await prisma.otpCodes.findFirst({
      where: {
        input: input,
      },
    });

    if (userCode) {
      await prisma.otpCodes.update({
        where: {
          id: userCode.id,
        },
        data: {
          hashedCode,
          expiresAt: moment().add(3, 'minutes').toDate(),
          isVerified: false,
          userType,
        },
      });
    } else {
      await prisma.otpCodes.create({
        data: {
          input,
          hashedCode,
          expiresAt: moment().add(3, 'minutes').toDate(),
          userType,
        },
      });
    }
  }

  public async sendEmailVerificationCode(email: string, userType: string) {
    joiValidator(
      { email: email },
      Joi.object({ email: Joi.string().email().required() }),
    );
    const { code, hashedCode } = await this.generateCode();
    await this.setOtpUserCode(email, 'USER', hashedCode);
    await this.emailProvider.sendVerify(email, code);
    await this.setOtpUserCode(email, userType, hashedCode);
  }

  public async sendVerificationCodeForget(email: string, userType: string) {
    joiValidator(
      { email: email },
      Joi.object({ email: Joi.string().email().required() }),
    );
    const { code, hashedCode } = await this.generateCode();
    await this.setOtpUserCode(email, 'USER', hashedCode);
    await this.emailProvider.sendForgetPasswordEmail(email, code);
    await this.setOtpUserCode(email, userType, hashedCode);
  }

  private async isOtpValid(
    input: string,
    code: string,
    userType: string,
  ): Promise<boolean> {
    const userCode = await prisma.otpCodes.findFirst({
      where: {
        input: input,
        userType: userType,
      },
    });

    if (userCode) {
      if (
        this.verificationCodeGenerator.verifyCode(
          code,
          userCode.hashedCode || '',
        )
      ) {
        if (moment().toDate() < moment(userCode.expiresAt).toDate()) {
          await prisma.otpCodes.update({
            where: {
              id: userCode.id,
            },
            data: {
              isVerified: true,
            },
          });
          return true;
        }
      }
    }
    return false;
  }

  private async isOtpValidForEmail(
    input: string,
    code: string,
    userType: string,
  ): Promise<boolean> {
    return this.isOtpValid(input, code, userType);
  }
}
