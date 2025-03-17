import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Attachment } from 'nodemailer/lib/mailer';

@Injectable()
export class MailService {
  private readonly from: string;

  constructor(private readonly mailerService: MailerService) {
    this.from = process.env.MAIL_FROM || 'noreply@localhost';
  }

  async sendVerificationEmail(email: string, code: string) {
    await this.mailerService.sendMail({
      from: this.from,
      to: email,
      subject: 'Email Verification',
      template: './verification',
      context: {
        code,
      },
    });
  }

  async sendForgetPasswordEmail(
    email: string,
    code: string,
    expireTime: number,
  ) {
    await this.mailerService.sendMail({
      from: this.from,
      to: email,
      subject: 'Forget Password',
      template: './forgetPassword/forgetPassword',
      context: {
        code,
        expire: expireTime,
      },
    });
  }

  async sendMail(
    email: string | string[],
    subject: string,
    template: string,
    context: Record<string, any>,
    attachments?: Attachment[],
    cc?: string | string[],
  ) {
    await this.mailerService.sendMail({
      from: this.from,
      to: email,
      cc,
      subject,
      template,
      context,
      attachments,
    });
  }
}
