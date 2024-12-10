import { Module } from '@nestjs/common';
import { PerbandinganSubKriteriaService } from './perbandingan_sub_kriteria.service';
import { PerbandinganSubKriteriaController } from './perbandingan_sub_kriteria.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [PerbandinganSubKriteriaController],
  providers: [PerbandinganSubKriteriaService, PrismaService],
})
export class PerbandinganSubKriteriaModule {}
