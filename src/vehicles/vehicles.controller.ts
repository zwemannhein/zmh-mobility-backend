import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { PrismaClient, Role } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('vehicles')
@UseGuards(JwtAuthGuard)
export class VehiclesController {
  constructor(private prisma: PrismaClient) {}

  @Get()
  async getAll(@Req() req: any) {
    const { userId, role } = req.user;
    const where = role === Role.OWNER ? { ownerId: userId } : {};
    const vehicles = await this.prisma.vehicle.findMany({
      where,
      include: { driver: { select: { id: true, name: true } } },
    });
    return vehicles;
  }
}
