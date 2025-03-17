import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { AdminsService } from 'src/admins/admins.service';
import { UsersModule } from 'src/users/users.module';
import { MailModule } from 'src/mail/mail.module';
import { ThrottlerModule } from '@nestjs/throttler';
import Verification from 'src/shared/utils/verfication/Verification';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
    MailModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          limit: 100,
          ttl: 60,
        },
      ],
    }),
  ],
  providers: [
    AuthService,
    UsersService,
    AdminsService,
    Verification,
    MailService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
