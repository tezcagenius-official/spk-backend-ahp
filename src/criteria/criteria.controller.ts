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
import {
  getResponseCriteriaDto,
  KriteriaFilterDto,
} from './dto/get_response_criteria.dto';
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
import { updateCriteriaDto } from './dto/edit_criteria.dto';

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
          divisi_id: dto.divisi_id,
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
  async findAll(
    @Query(new ValidationPipe({ transform: true })) filter: KriteriaFilterDto,
    @Res() res: Response,
  ) {
    try {
      const totalCount = await this.prisma.kriteria.count({
        where: {
          ...(filter.divisi_id ? { divisi_id: filter.divisi_id } : {}),
        },
      });

      const { page, perPage, skip, meta } = createPagination(
        filter,
        totalCount,
      );

      const kriteria = await this.prisma.kriteria.findMany({
        where: {
          ...(filter.divisi_id ? { divisi_id: filter.divisi_id } : {}),
        },
        include: {
          divisi: {
            select: {
              nama_divisi: true,
            },
          },
        },
        skip,
        take: perPage,
      });

      const result = kriteria.map((item) => {
        return {
          kriteria_id: item.kriteria_id,
          nama_kriteria: item.nama_kriteria,
          prioritas: item.prioritas,
          divisi_id: item.divisi_id,
          nama_divisi: item.divisi.nama_divisi,
        };
      });

      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: kriteria.length
          ? 'Berhasil Mengambil Data Kriteria'
          : 'Data belum ada',
        data: result,
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
        include: {
          divisi: {
            select: {
              nama_divisi: true,
            },
          },
        },
      });

      const result = {
        kriteria_id: kriteria.kriteria_id,
        nama_kriteria: kriteria.nama_kriteria,
        prioritas: kriteria.prioritas,
        divisi_id: kriteria.divisi_id,
        nama_divisi: kriteria.divisi.nama_divisi,
      };

      return res.status(HttpStatus.OK).json({
        status: 200,
        message: 'Kriteria Berhasil Diambil',
        data: result,
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
    @Body() dto: updateCriteriaDto,
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
