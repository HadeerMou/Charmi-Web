export default interface EmailRepository {
  // sendEmail(to: string, subject: string, body: string): Promise<void>;
  sendVerify(to: string, otp?: string): Promise<boolean | string>;
  verify(to: string, code: string): Promise<boolean>;
  validateEmail(email: string): Promise<boolean>;
}
