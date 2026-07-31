import {
  Body,
  Controller,
  Headers,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('checkout-session')
  createCheckoutSession(@Body('cardId') cardId: string) {
    return this.paymentsService.createCheckoutSession(cardId);
  }

  @Post('webhook')
  async webhook(@Req() req: any, @Headers('stripe-signature') signature: string) {
    const event = this.paymentsService.constructEvent(req.rawBody, signature);
    await this.paymentsService.handleWebhookEvent(event);
    return { received: true };
  }
}
