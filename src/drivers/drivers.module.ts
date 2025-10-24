import { Module } from '@nestjs/common';
import { DriversController } from './drivers.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule], // 👈 needed to inject PrismaClient
  controllers: [DriversController],
})
export class DriversModule {}
