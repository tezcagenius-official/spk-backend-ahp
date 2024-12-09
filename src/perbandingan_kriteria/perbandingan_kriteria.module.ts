import { Module } from '@nestjs/common';
import { PerbandinganKriteriaService } from './perbandingan_kriteria.service';
import { PerbandinganKriteriaController } from './perbandingan_kriteria.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [PerbandinganKriteriaController],
  providers: [PerbandinganKriteriaService, PrismaService],
})
export class PerbandinganKriteriaModule {}
