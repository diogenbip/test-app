import { Controller, Post, Query, UseGuards } from '@nestjs/common';
import { SendgridService } from '../sendgrid/sendgrid.service';
import { ApiBearerAuth, ApiCreatedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('email')
export class EmailController {
  constructor(private readonly sendgridService: SendgridService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Sample using sendgrid service' })
  @Post('send-email')
  async sendEmail(@Query('email') email) {
    const mail = {
      to: email,
      subject: 'Hello from sendgrid',
      from: '...', // Fill it with your validated email on SendGrid account
      text: 'Hello',
      html: '<h1>Hello</h1>',
    };

    await this.sendgridService.send(mail);
  }
}
