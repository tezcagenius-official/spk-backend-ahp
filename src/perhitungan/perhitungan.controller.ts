import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { PerhitunganService } from './perhitungan.service';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatePenilaianAlternatifDto } from './dto/penilaian_alternatif.dto';
import {
  ApiStandartResponse,
  ApiStandartResponseArray,
  ApiStandartResponseCreate,
  ApiStandartResponseDeleted,
} from 'src/schema_standart/flexibelSchema';
import { GetAlternatifByIdResponseDto } from './dto/response_get_alternatif_byID.dto';
import { UpsertPenilaianAlternatifDto } from './dto/upsert_penilaian.dto';
import {
  HasilPerhitunganResponseDto,
  RankingFilterDto,
} from './dto/response_hasil_perhitungan.dto';
import { paginationDekoratorDto } from 'src/common/interface/paginationDekorator';
import { createPagination } from 'src/common/interface/pagination.util';
import { env } from 'process';
import { ApiBearerAuth } from 'src/common/decorator/bearer_auth';
import { ERole } from 'src/common/enum/ERole';
import {
  createResponseDto,
  deleteResponseDto,
} from 'src/auth/dto/response-crud.dto';
import { GetAlternatifByDivisiDto } from './dto/response_get_alternatif_by_divisi.dto';

@ApiTags('Perhitungan')
@Controller('/api/perhitungan')
export class PerhitunganController {
  constructor(private readonly perhitunganService: PerhitunganService) {}

  @ApiBearerAuth([ERole.ADM, ERole.SPA])
  @ApiStandartResponseArray(GetAlternatifByDivisiDto)
  @Get('by-divisi/:divisi_id')
  async getAlternatifByDivisi(
    @Param('divisi_id') divisi_id: number,
    @Res() res: Response,
  ) {
    try {
      const alternate =
        await this.perhitunganService.getAlternatifByDivisi(divisi_id);

      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: alternate.message,
        data: alternate.result,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
      });
    }
  }

  @ApiBearerAuth([ERole.ADM])
  @ApiStandartResponse(GetAlternatifByIdResponseDto)
  @Get('/:alternatif_id')
  async getAlternatifById(
    @Param('alternatif_id') alternatif_id: number,
    @Res() res: Response,
  ) {
    try {
      const alternate =
        await this.perhitunganService.getAlternatifById(alternatif_id);

      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: alternate.message,
        data: alternate.data,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
      });
    }
  }

  @ApiBearerAuth([ERole.ADM])
  @ApiStandartResponseCreate(createResponseDto)
  @Post()
  async upsertPenilaianAlternatif(
    @Body() payload: UpsertPenilaianAlternatifDto,
    @Res() res: Response,
  ) {
    try {
      const penilaian =
        await this.perhitunganService.upsertPenilaianAlternatif(payload);

      return res.status(HttpStatus.CREATED).json({
        status: HttpStatus.CREATED,
        message: penilaian.message,
        data: {},
      });
    } catch (error) {
      console.log(error);

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
      });
    }
  }

  @ApiBearerAuth([ERole.ADM, ERole.SPA])
  @ApiStandartResponseArray(HasilPerhitunganResponseDto)
  @Get()
  async hasilPerhitungan(
    @Query(new ValidationPipe({ transform: true })) filter: RankingFilterDto,
    @Res() res: Response,
  ) {
    try {
      const totalCount = await this.perhitunganService.countAlternatif(
        filter.divisi_id,
      );
      const { page, perPage, skip, meta } = createPagination(
        filter,
        totalCount,
      );

      const result = await this.perhitunganService.hasilPerhitungan(
        skip,
        perPage,
        filter.divisi_id,
      );

      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: result.message,
        data: result.filteredResult,
        meta: {
          ...meta,
          prev:
            page > 1
              ? `${env.BASE_URL}/api/perhitungan?page=${page - 1}&perPage=${perPage}`
              : null,
          next:
            page < meta.lastPage
              ? `${env.BASE_URL}/api/perhitungan?page=${page + 1}&perPage=${perPage}`
              : null,
        },
      });
    } catch (error) {
      console.log(error);

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
      });
    }
  }

  @ApiBearerAuth([ERole.ADM])
  @ApiStandartResponseDeleted(deleteResponseDto)
  @Delete('/:alternatif_id')
  async deletePerhitungan(
    @Param('alternatif_id') alternatif_id: number,
    @Res() res: Response,
  ) {
    try {
      const destroy =
        await this.perhitunganService.deletePerhitungan(alternatif_id);

      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: destroy.message,
        data: {},
      });
    } catch (error) {
      console.log(error);

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
      });
    }
  }
}
