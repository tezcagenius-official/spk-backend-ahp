import { Module } from '@nestjs/common';
import { DivisiService } from './divisi.service';
import { DivisiController } from './divisi.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [DivisiController],
  providers: [DivisiService, PrismaService],
})
export class DivisiModule {}
