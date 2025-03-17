import EmailRepository from './EmailRepository';
import { MailService } from 'src/mail/mail.service';
import VerificationCodeGenerator from '../code-generator/VerificationCodeGenerator';

export default class NodeMailerRepository implements EmailRepository {
  private verificationCodeGenerator: VerificationCodeGenerator;
  private mailerService: MailService;
  constructor(mailerService: MailService) {
    this.mailerService = mailerService;
    this.verificationCodeGenerator = new VerificationCodeGenerator();
  }

  async sendVerify(to: string, otp: string): Promise<string> {
    await this.mailerService.sendVerificationEmail(to, otp);
    return otp;
  }

  async sendForgetPasswordEmail(to: string, otp: string): Promise<string> {
    await this.mailerService.sendForgetPasswordEmail(to, otp, 3);
    return otp;
  }

  verify(to: string, code: string, input?: string): Promise<boolean> {
    return Promise.resolve(
      this.verificationCodeGenerator.verifyCode(code, input || ''),
    );
  }

  validateEmail(): Promise<boolean> {
    return Promise.resolve(true);
  }
}
