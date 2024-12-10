import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { PerhitunganService } from './perhitungan.service';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiTags } from '@nestjs/swagger';
import { CreatePenilaianAlternatifDto } from './dto/penilaian_alternatif.dto';

@ApiTags('Perhitungan')
@Controller('/api/perhitungan')
export class PerhitunganController {
  constructor(private readonly perhitunganService: PerhitunganService) {}

  // @Post()
  // async createPenilaianAlternatif(
  //   @Body() payload: CreatePenilaianAlternatifDto, // Validasi payload dengan DTO
  //   @Res() res: Response,
  // ) {
  //   try {
  //     const result =
  //       await this.perhitunganService.upsertPenilaianAlternatif(payload);

  //     return res.status(HttpStatus.CREATED).json({
  //       status: HttpStatus.CREATED,
  //       message: result.message,
  //       data: result.insertedRecords,
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
  //       status: HttpStatus.INTERNAL_SERVER_ERROR,
  //       message: 'Terjadi kesalahan saat menyimpan penilaian alternatif.',
  //     });
  //   }
  // }

  // @Get()
  // async findAll(@Res() res: Response) {
  //   try {
  //     const result = await this.perhitunganService.findAll();

  //     return res.status(HttpStatus.OK).json({
  //       status: HttpStatus.OK,
  //       message: result.message,
  //       data: result.penilaian,
  //     });
  //   } catch (error) {
  //     return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
  //       status: HttpStatus.INTERNAL_SERVER_ERROR,
  //       message: 'Internal Server Error',
  //     });
  //   }
  // }
}
