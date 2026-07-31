import { Injectable, NotFoundException } from '@nestjs/common';
import Stripe from 'stripe';
import { CardsService } from '../cards/cards.service';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(private readonly cardsService: CardsService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
      apiVersion: '2024-06-20',
    });
  }

  async createCheckoutSession(cardId: string) {
    const card = await this.cardsService.findOne(cardId);
    if (!card) throw new NotFoundException('Carte introuvable');

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Modele premium - ${card.template.name}`,
              description: 'Deverrouille ta carte Fetia en haute qualite, sans filigrane.',
            },
            unit_amount: card.template.priceCents,
          },
          quantity: 1,
        },
      ],
      metadata: { cardId: card.id },
      success_url: `${frontendUrl}/checkout/success?slug=${card.slug}`,
      cancel_url: `${frontendUrl}/checkout/cancel?slug=${card.slug}`,
    });

    return { url: session.url };
  }

  constructEvent(payload: Buffer, signature: string) {
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || '',
    );
  }

  async handleWebhookEvent(event: Stripe.Event) {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const cardId = session.metadata?.cardId;
      if (cardId) {
        await this.cardsService.unlock(cardId);
      }
    }
  }
}
