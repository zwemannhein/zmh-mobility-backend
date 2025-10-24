import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private auth: AuthService,
    private prisma: PrismaClient,
  ) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.auth.validateUser(dto.email, dto.password);
    const token = this.auth.sign({
      id: user.id,
      role: user.role,
      name: user.name,
    });
    return { access_token: token, role: user.role, name: user.name };
  }

  @Post('register')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async register(@Body() dto: RegisterDto) {
    const hash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: hash,
        role: dto.role,
      },
    });

    if (dto.role === Role.DRIVER) {
      await this.prisma.vehicle.create({
        data: {
          carType: dto.carType ?? 'Unknown',
          carNumber: dto.carNumber ?? 'UNKNOWN',
          ownerId: dto.ownerId!,
          driverId: user.id,
        },
      });
    }
    return user;
  }
}
