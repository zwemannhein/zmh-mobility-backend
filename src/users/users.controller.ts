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

  // 🔹 Get all users (Admin only)
  @Get()
  @Roles(Role.ADMIN)
  async findAll() {
    return this.usersService.findAll();
  }

  // 🔹 Create new user (Admin only)
  @Post()
  @Roles(Role.ADMIN)
  async createUser(
    @Body() body: { name: string; email: string; password: string; role: Role },
  ) {
    return this.usersService.create(body);
  }

  // 🔹 Delete user by ID (Admin only)
  @Delete(':id')
  @Roles(Role.ADMIN)
  async deleteUser(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
