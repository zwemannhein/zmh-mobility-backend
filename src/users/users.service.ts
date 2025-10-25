import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // 🔹 Get all users
  async findAll() {
    return this.prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true },
    });
  }

  // 🔹 Create a new user (Admin only)
  async create(data: {
    name: string;
    email: string;
    password: string;
    role: Role;
  }) {
    const hashed = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashed,
        role: data.role,
      },
    });
  }

  // 🔹 Delete a user
  async delete(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
