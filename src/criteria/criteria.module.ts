import { Module } from '@nestjs/common';
import { CriteriaService } from './criteria.service';
import { CriteriaController } from './criteria.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [CriteriaController],
  providers: [CriteriaService, PrismaService],
})
export class CriteriaModule {}
