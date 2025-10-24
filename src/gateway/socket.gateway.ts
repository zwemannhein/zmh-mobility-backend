import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { PrismaClient, Role } from '@prisma/client';

@WebSocketGateway({ cors: { origin: true }, namespace: '/rt' })
export class SocketGateway {
  @WebSocketServer() io: Server;
  private prisma = new PrismaClient();

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      const payload: any = jwt.verify(token, process.env.JWT_SECRET!);
      (client as any).user = payload;

      if (payload.role === Role.OWNER) client.join(`owner:${payload.sub}`);
      if (payload.role === Role.DRIVER) {
        const vehicle = await this.prisma.vehicle.findFirst({
          where: { driverId: payload.sub },
        });
        if (vehicle) client.join(`vehicle:${vehicle.id}`);
      }
    } catch {
      client.disconnect();
    }
  }

  @SubscribeMessage('driverLocation')
  async handleDriverLocation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { lat: number; lng: number },
  ) {
    const user = (client as any).user;
    if (user.role !== Role.DRIVER) return;
    const vehicle = await this.prisma.vehicle.findFirst({
      where: { driverId: user.sub },
    });
    if (!vehicle) return;

    const loc = await this.prisma.driverLocation.create({
      data: {
        driverId: user.sub,
        vehicleId: vehicle.id,
        lat: data.lat,
        lng: data.lng,
      },
    });

    this.io.to(`vehicle:${vehicle.id}`).emit('driverLocationUpdate', loc);
    this.io.to(`owner:${vehicle.ownerId}`).emit('driverLocationUpdate', loc);
  }
}
