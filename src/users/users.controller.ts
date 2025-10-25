import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  // ✅ CREATE USER (Admin only)
  @Post()
  @Roles(Role.ADMIN)
  create(
    @Body() dto: { name: string; email: string; password: string; role: Role },
  ) {
    return this.usersService.create(dto);
  }

  // ✅ DELETE USER
  @Delete(':id')
  @Roles(Role.ADMIN)
  delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
