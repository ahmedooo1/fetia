import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { CreateRsvpDto } from './dto/create-rsvp.dto';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: any, @Body() dto: CreateCardDto) {
    return this.cardsService.create(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('mine')
  findMine(@Req() req: any) {
    return this.cardsService.findMine(req.user.id);
  }

  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 60, ttl: 60 * 1000 } })
  @Get('public/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.cardsService.findBySlug(slug);
  }

  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 10 * 60 * 1000 } })
  @Post('public/:slug/rsvp')
  createRsvp(@Param('slug') slug: string, @Body() dto: CreateRsvpDto) {
    return this.cardsService.createRsvp(slug, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.cardsService.findOneOwned(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/rsvps')
  listRsvps(@Req() req: any, @Param('id') id: string) {
    return this.cardsService.listRsvps(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateCardDto) {
    return this.cardsService.update(id, req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.cardsService.remove(id, req.user.id);
  }
}
