import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { AdminMails } from '../enums/adminMails.enum';
import { OrdersService } from 'src/orders/orders.service';
import { OrderWithRelations } from 'src/types';

@Injectable()
export class SendOrderAfterCreationInterceptor implements NestInterceptor {
  constructor(private orderService: OrdersService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      tap({
        next: () => {
          const req = context.switchToHttp().getRequest<{ order: any }>();
          const order: OrderWithRelations = req.order as OrderWithRelations;
          const admins = Object.values(AdminMails);

          Promise.allSettled([
            this.orderService.sendMail(order),
            this.orderService.sendMailToAdmins(order, admins),
          ]).catch((globalError) => {
            console.error(
              'Global error in SendOrderAfterCreationInterceptor:',
              globalError,
            );
          });
        },
        error: (error) => {
          console.log('Error in order creation process', error);
        },
      }),
    );
  }
}
