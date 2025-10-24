import { Module } from '@nestjs/common';
import { TripsController } from './trips.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule], // 👈 needed to inject PrismaClient
  controllers: [TripsController],
})
export class TripsModule {}
