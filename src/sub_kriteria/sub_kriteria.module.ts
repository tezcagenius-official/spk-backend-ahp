import { Module } from '@nestjs/common';
import { SubKriteriaService } from './sub_kriteria.service';
import { SubKriteriaController } from './sub_kriteria.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [SubKriteriaController],
  providers: [SubKriteriaService, PrismaService],
})
export class SubKriteriaModule {}
