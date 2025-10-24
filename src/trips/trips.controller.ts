import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PrismaClient, Role, TripStatus, TripType } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('trips')
@UseGuards(JwtAuthGuard)
export class TripsController {
  constructor(private prisma: PrismaClient) {}

  @Post()
  async create(@Req() req: any, @Body() body: any) {
    const { userId, role } = req.user;
    if (role !== Role.DRIVER) throw new Error('Only drivers can create trips');
    return this.prisma.trip.create({
      data: {
        type: body.type as TripType,
        status: TripStatus.PLANNED,
        driverId: userId,
        vehicleId: body.vehicleId,
        destinationName: body.destinationName,
        destinationPlaceId: body.destinationPlaceId,
      },
    });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.prisma.trip.update({ where: { id }, data });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.prisma.trip.findUnique({
      where: { id },
      include: { driver: true, vehicle: true },
    });
  }
}
