import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoryModule } from './category/category.module';
import { ProductImagesModule } from './product-images/product-images.module';
import { CartItemsModule } from './cart-items/cart-items.module';
import { OrdersModule } from './orders/orders.module';
import { MailModule } from './mail/mail.module';
import { CartController } from './cart/cart.controller';
import { CartService } from './cart/cart.service';
import { ProductsController } from './products/products.controller';
import { ProductsService } from './products/products.service';
import { AddressModule } from './address/address.module';
import { CitiesModule } from './cities/cities.module';
import { CountryModule } from './country/country.module';
import { ProductsModule } from './products/products.module';
import { ConfigModule } from '@nestjs/config';
import { AdminsModule } from './admins/admins.module';
import { ShippingFeesModule } from './shipping-fees/shipping-fees.module';
import { DistrictModule } from './district/district.module';
import { Product3DModule } from './product-threeD/product-threeD.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    CategoryModule,
    ProductImagesModule,
    Product3DModule,
    CartItemsModule,
    OrdersModule,
    MailModule,
    AddressModule,
    CitiesModule,
    CountryModule,
    ProductsModule,
    AdminsModule,
    AdminsModule,
    ShippingFeesModule,
    DistrictModule,
  ],
  controllers: [AppController, CartController, ProductsController],
  providers: [AppService, CartService, ProductsService],
})
export class AppModule {}
