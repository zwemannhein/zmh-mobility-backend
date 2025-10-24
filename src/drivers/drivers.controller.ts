import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('drivers')
@UseGuards(JwtAuthGuard)
export class DriversController {
  constructor(private prisma: PrismaClient) {}

  @Post(':id/location')
  async updateLocation(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    if (req.user.userId !== id) throw new Error('Unauthorized');
    return this.prisma.driverLocation.create({
      data: {
        driverId: id,
        vehicleId: body.vehicleId,
        lat: body.lat,
        lng: body.lng,
      },
    });
  }
}
