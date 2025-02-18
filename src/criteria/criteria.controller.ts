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
} from '@nestjs/common';
import { CriteriaService } from './criteria.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import {
  ApiStandartResponse,
  ApiStandartResponseArray,
  ApiStandartResponseCreate,
  ApiStandartResponseDeleted,
  ApiStandartResponseUpdated,
} from 'src/schema_standart/flexibelSchema';
import { getResponseCriteriaDto } from './dto/get_response_criteria.dto';
import { createCriteriaDto } from './dto/create_criteria.dto';
import {
  createResponseDto,
  deleteResponseDto,
  updateResponseDto,
} from 'src/auth/dto/response-crud.dto';
import { ApiBearerAuth } from 'src/common/decorator/bearer_auth';
import { ERole } from 'src/common/enum/ERole';
import { paginationDekoratorDto } from 'src/common/interface/paginationDekorator';
import { createPagination } from 'src/common/interface/pagination.util';
import { env } from 'process';

@ApiTags('Kriteria')
@Controller('/api/criteria')
export class CriteriaController {
  constructor(
    private readonly criteriaService: CriteriaService,
    private readonly prisma: PrismaService,
  ) {}

  @ApiBearerAuth([ERole.SPA])
  @ApiStandartResponseCreate(createResponseDto)
  @Post()
  async create(@Body() dto: createCriteriaDto, @Res() res: Response) {
    try {
      const create = await this.prisma.kriteria.create({
        data: {
          nama_kriteria: dto.nama_kriteria,
        },
      });

      return res.status(HttpStatus.CREATED).json({
        status: 201,
        message: 'Berhasil Menambahkan Kriteria',
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 500,
        message: 'Internal Server Error',
      });
    }
  }

  @ApiBearerAuth([ERole.ADM, ERole.SPA])
  @ApiStandartResponseArray(getResponseCriteriaDto)
  @Get()
  async findAll(@Query() filter: paginationDekoratorDto, @Res() res: Response) {
    try {
      const totalCount = await this.prisma.kriteria.count();

      const { page, perPage, skip, meta } = createPagination(
        filter,
        totalCount,
      );

      const kriteria = await this.prisma.kriteria.findMany({
        skip,
        take: perPage,
      });

      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: 'Kriteria Berhasil Diambil',
        data: kriteria,
        meta: {
          ...meta,
          prev:
            page > 1
              ? `${env.BASE_URL}/api/criteria?page=${page - 1}&perPage=${perPage}`
              : null,
          next:
            page < meta.lastPage
              ? `${env.BASE_URL}/api/criteria?page=${page + 1}&perPage=${perPage}`
              : null,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 500,
        message: 'Internal Server Error',
      });
    }
  }

  @ApiBearerAuth([ERole.ADM, ERole.SPA])
  @ApiStandartResponse(getResponseCriteriaDto)
  @Get('/:id')
  async findOne(@Param('id') id: number, @Res() res: Response) {
    try {
      const kriteria = await this.prisma.kriteria.findFirst({
        where: {
          kriteria_id: id,
        },
      });

      return res.status(HttpStatus.OK).json({
        status: 200,
        message: 'Kriteria Berhasil Diambil',
        data: kriteria,
      });
    } catch (error) {
      console.log(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 500,
        message: 'Internal Server Error',
      });
    }
  }

  @ApiBearerAuth([ERole.SPA])
  @ApiStandartResponseUpdated(updateResponseDto)
  @Patch('/:id')
  async update(
    @Param('id') id: number,
    @Body() dto: createCriteriaDto,
    @Res() res: Response,
  ) {
    try {
      const update = await this.prisma.kriteria.update({
        where: {
          kriteria_id: id,
        },
        data: {
          nama_kriteria: dto.nama_kriteria,
        },
      });

      return res.status(HttpStatus.CREATED).json({
        status: 201,
        message: 'Berhasil Merubah Kriteria',
      });
    } catch (error) {
      console.log(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 500,
        message: 'Internal Server Error',
      });
    }
  }

  @ApiBearerAuth([ERole.SPA])
  @ApiStandartResponseDeleted(deleteResponseDto)
  @Delete('/:id')
  async delete(@Param('id') id: number, @Res() res: Response) {
    try {
      const hasil = await this.prisma.hasil_perhitungan.deleteMany();

      const penilaian = await this.prisma.penilaian_alternatif.deleteMany();

      const perbandinganSub =
        await this.prisma.perbandingan_sub_kriteria.deleteMany({
          where: {
            kriteria_id: id,
          },
        });

      const Sub = await this.prisma.sub_kriteria.deleteMany({
        where: {
          kriteria_id: id,
        },
      });

      const perbandingan = await this.prisma.perbandingan_kriteria.deleteMany();

      const deleteKriteria = await this.prisma.kriteria.delete({
        where: {
          kriteria_id: id,
        },
      });

      const update = await this.prisma.kriteria.updateMany({
        data: {
          prioritas: null,
        },
      });

      return res.status(HttpStatus.OK).json({
        status: 200,
        message: 'Berhasil Menghapus Kriteria',
        data: {},
      });
    } catch (error) {
      console.log(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 500,
        message: 'Internal Server Error',
      });
    }
  }
}
