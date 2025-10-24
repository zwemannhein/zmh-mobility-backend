import { Module } from '@nestjs/common';
import { VehiclesController } from './vehicles.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule], // 👈 THIS is what tells NestJS to include Prisma
  controllers: [VehiclesController],
})
export class VehiclesModule {}
