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
import { SubKriteriaService } from './sub_kriteria.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import {
  ApiStandartResponse,
  ApiStandartResponseArray,
  ApiStandartResponseCreate,
  ApiStandartResponseDeleted,
  ApiStandartResponseUpdated,
} from 'src/schema_standart/flexibelSchema';
import {
  createResponseDto,
  deleteResponseDto,
  updateResponseDto,
} from 'src/auth/dto/response-crud.dto';
import { createSubKriteriaDto } from './dto/create_sub_kriteria';
import {
  getResponseSubCriteriaDto,
  SubKriteriaFilterDto,
} from './dto/get_response_sub_kriteria';
import { updateSubKriteriaDto } from './dto/update_sub_kriteria';
import { ApiBearerAuth } from 'src/common/decorator/bearer_auth';
import { ERole } from 'src/common/enum/ERole';
import { paginationDekoratorDto } from 'src/common/interface/paginationDekorator';
import { createPagination } from 'src/common/interface/pagination.util';
import { env } from 'process';

@ApiTags('Sub Kriteria')
@Controller('/api/sub-kriteria')
export class SubKriteriaController {
  constructor(
    private readonly subKriteriaService: SubKriteriaService,
    private readonly prisma: PrismaService,
  ) {}

  @ApiBearerAuth([ERole.SPA])
  @ApiStandartResponseCreate(createResponseDto)
  @Post()
  async create(@Body() dto: createSubKriteriaDto, @Res() res: Response) {
    try {
      const create = await this.prisma.sub_kriteria.create({
        data: {
          kriteria_id: dto.kriteria_id,
          nama_sub_kriteria: dto.nama_sub_kriteria,
        },
      });

      return res.status(HttpStatus.CREATED).json({
        status: 201,
        message: 'Berhasil Menambahkan Sub Kriteria',
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 500,
        message: 'Internal Server Error',
      });
    }
  }

  @ApiBearerAuth([ERole.ADM, ERole.SPA])
  @ApiStandartResponseArray(getResponseSubCriteriaDto)
  @Get()
  async findAll(
    @Query(new ValidationPipe({ transform: true }))
    filter: SubKriteriaFilterDto,
    @Res() res: Response,
  ) {
    try {
      const totalCount = await this.prisma.sub_kriteria.count({
        where: {
          ...(filter.kriteria_id ? { kriteria_id: filter.kriteria_id } : {}),
        },
      });

      const { page, perPage, skip, meta } = createPagination(
        filter,
        totalCount,
      );

      const subKriteria = await this.prisma.sub_kriteria.findMany({
        where: {
          ...(filter.kriteria_id ? { kriteria_id: filter.kriteria_id } : {}),
        },
        skip,
        take: perPage,
      });

      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: subKriteria.length
          ? 'Berhasil Mengambil Data Sub Kriteria'
          : 'Data belum ada',
        data: subKriteria,
        meta: {
          ...meta,
          prev:
            page > 1
              ? `${env.BASE_URL}/api/sub-kriteria?page=${page - 1}&perPage=${perPage}`
              : null,
          next:
            page < meta.lastPage
              ? `${env.BASE_URL}/api/sub-kriteria?page=${page + 1}&perPage=${perPage}`
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
  @ApiStandartResponse(getResponseSubCriteriaDto)
  @Get('/:id')
  async findOne(@Param('id') id: number, @Res() res: Response) {
    try {
      const kriteria = await this.prisma.sub_kriteria.findFirst({
        where: {
          sub_kriteria_id: id,
        },
      });

      return res.status(HttpStatus.OK).json({
        status: 200,
        message: 'Sub Kriteria Berhasil Diambil',
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
    @Body() dto: updateSubKriteriaDto,
    @Res() res: Response,
  ) {
    try {
      const update = await this.prisma.sub_kriteria.update({
        where: {
          sub_kriteria_id: id,
        },
        data: {
          nama_sub_kriteria: dto.nama_sub_kriteria,
        },
      });

      return res.status(HttpStatus.CREATED).json({
        status: 200,
        message: 'Berhasil Merubah Sub Kriteria',
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
            OR: [{ sub_kriteria1_id: id }, { sub_kriteria2_id: id }],
          },
        });

      const deleteSubKriteria = await this.prisma.sub_kriteria.delete({
        where: {
          sub_kriteria_id: id,
        },
      });

      return res.status(HttpStatus.OK).json({
        status: 200,
        message: 'Berhasil Menghapus Sub Kriteria',
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
