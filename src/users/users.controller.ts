import { Controller, Get, Delete, Param, UseGuards } from '@nestjs/common';
import { PrismaClient, Role } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class UsersController {
  constructor(private prisma: PrismaClient) {}

  @Get()
  getAll() {
    return this.prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true },
    });
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
