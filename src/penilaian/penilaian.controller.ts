import { Controller, Get, HttpStatus, Post, Query, Res } from '@nestjs/common';
import { PenilaianService } from './penilaian.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { filterPenilaianDto } from './filter_penilaian.dto';

@Controller('/api/penilaian')
export class PenilaianController {
  constructor(
    private readonly penilaianService: PenilaianService,
    private readonly prisma: PrismaService,
  ) {}
}
