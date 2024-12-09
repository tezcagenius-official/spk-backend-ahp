import { Module } from '@nestjs/common';
import { PerhitunganService } from './perhitungan.service';
import { PerhitunganController } from './perhitungan.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [PerhitunganController],
  providers: [PerhitunganService, PrismaService],
})
export class PerhitunganModule {}
