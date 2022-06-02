import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { JwtModule } from '@nestjs/jwt';
import { join } from 'path';
import { UsersModule } from '../users/users.module';
import { EmailController } from './email.controller';
import {SendgridService} from "../sendgrid/sendgrid.service";

@Module({
  imports: [
    JwtModule,
    UsersModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('TRANSPORT_HOST'),
          port: configService.get('TRANSPORT_PORT'),
          auth: {
            user: configService.get('TRANSPORT_USER'),
            pass: configService.get('TRANSPORT_PASS'),
          },
          tls: {
            rejectUnauthorized: false,
          },
        },
        defaults: {
          from: `"${configService.get('MAIL_FROM_NAME')}" <${configService.get(
            'TRANSPORT_USER',
          )}>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [EmailController],
  providers: [EmailService, SendgridService],
  exports: [EmailService],
})
export class EmailModule {}
