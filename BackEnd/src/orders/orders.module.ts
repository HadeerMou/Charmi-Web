import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { MailService } from 'src/mail/mail.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, MailService],
})
export class OrdersModule {}
