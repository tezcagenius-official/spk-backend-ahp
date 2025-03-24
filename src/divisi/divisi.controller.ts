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
import { DivisiService } from './divisi.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { ApiBearerAuth } from 'src/common/decorator/bearer_auth';
import { ERole } from 'src/common/enum/ERole';
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
import { createDivisiDto } from './dto/create_divisi.dto';
import { getResponseDivisiDto } from './dto/get_response_criteria.dto';
import { paginationDekoratorDto } from 'src/common/interface/paginationDekorator';
import { createPagination } from 'src/common/interface/pagination.util';
import { env } from 'process';

@ApiTags('Divisi')
@Controller('divisi')
export class DivisiController {
  constructor(
    private readonly divisiService: DivisiService,
    private readonly prisma: PrismaService,
  ) {}

  @ApiBearerAuth([ERole.ADM])
  @ApiStandartResponseCreate(createResponseDto)
  @Post()
  async create(@Body() dto: createDivisiDto, @Res() res: Response) {
    try {
      const create = await this.prisma.divisi.create({
        data: {
          nama_divisi: dto.nama_divisi,
        },
      });

      return res.status(HttpStatus.CREATED).json({
        status: 201,
        message: 'Berhasil Menambahkan Divisi',
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 500,
        message: 'Internal Server Error',
      });
    }
  }

  @ApiBearerAuth([ERole.ADM, ERole.SPA])
  @ApiStandartResponseArray(getResponseDivisiDto)
  @Get()
  async findAll(@Query() filter: paginationDekoratorDto, @Res() res: Response) {
    try {
      const totalCount = await this.prisma.divisi.count();

      const { page, perPage, skip, meta } = createPagination(
        filter,
        totalCount,
      );

      const divisi = await this.prisma.divisi.findMany({
        skip,
        take: perPage,
      });

      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: 'Divisi Berhasil Diambil',
        data: divisi,
        meta: {
          ...meta,
          prev:
            page > 1
              ? `${env.BASE_URL}/api/divisi?page=${page - 1}&perPage=${perPage}`
              : null,
          next:
            page < meta.lastPage
              ? `${env.BASE_URL}/api/divisi?page=${page + 1}&perPage=${perPage}`
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
  @ApiStandartResponse(getResponseDivisiDto)
  @Get('/:id')
  async findOne(@Param('id') id: number, @Res() res: Response) {
    try {
      const divisi = await this.prisma.divisi.findFirst({
        where: {
          divisi_id: id,
        },
      });

      return res.status(HttpStatus.OK).json({
        status: 200,
        message: 'Divisi Berhasil Diambil',
        data: divisi,
      });
    } catch (error) {
      console.log(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 500,
        message: 'Internal Server Error',
      });
    }
  }

  @ApiBearerAuth([ERole.ADM])
  @ApiStandartResponseUpdated(updateResponseDto)
  @Patch('/:id')
  async update(
    @Param('id') id: number,
    @Body() dto: createDivisiDto,
    @Res() res: Response,
  ) {
    try {
      const update = await this.prisma.divisi.update({
        where: {
          divisi_id: id,
        },
        data: {
          nama_divisi: dto.nama_divisi,
        },
      });

      return res.status(HttpStatus.CREATED).json({
        status: 201,
        message: 'Berhasil Merubah Divisi',
      });
    } catch (error) {
      console.log(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 500,
        message: 'Internal Server Error',
      });
    }
  }

  @ApiBearerAuth([ERole.ADM])
  @ApiStandartResponseDeleted(deleteResponseDto)
  @Delete('/:id')
  async delete(@Param('id') id: number, @Res() res: Response) {
    try {
      const alternatif = await this.prisma.alternatif.deleteMany({
        where: {
          divisi_id: id,
        },
      });

      const penilaian_alternatif =
        await this.prisma.penilaian_alternatif.deleteMany({
          where: {
            divisi_id: id,
          },
        });

      const hasil_perhitungan = await this.prisma.hasil_perhitungan.deleteMany({
        where: {
          divisi_id: id,
        },
      });

      const deleteDivisi = await this.prisma.divisi.delete({
        where: {
          divisi_id: id,
        },
      });

      return res.status(HttpStatus.OK).json({
        status: 200,
        message: 'Berhasil Menghapus Divisi',
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
