import { Module } from '@nestjs/common';
import { AlternatifService } from './alternatif.service';
import { AlternatifController } from './alternatif.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [AlternatifController],
  providers: [AlternatifService, PrismaService],
})
export class AlternatifModule {}
