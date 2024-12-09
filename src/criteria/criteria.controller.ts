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

@ApiTags('Kriteria')
@Controller('/api/criteria')
export class CriteriaController {
  constructor(
    private readonly criteriaService: CriteriaService,
    private readonly prisma: PrismaService,
  ) {}

  @ApiStandartResponseCreate(createResponseDto)
  @Post('/create')
  async create(@Body() dto: createCriteriaDto, @Res() res: Response) {
    try {
      const create = await this.prisma.kriteria.create({
        data: {
          nama_kriteria: dto.nama_kriteria,
        },
      });

      res.status(HttpStatus.CREATED).json({
        status: 201,
        message: 'Berhasil Menambahkan Kriteria',
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 500,
        message: 'Internal Server Error',
      });
    }
  }

  @ApiStandartResponseArray(getResponseCriteriaDto)
  @Get()
  async findAll(@Res() res: Response) {
    try {
      const kriteria = await this.prisma.kriteria.findMany();

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

  @ApiStandartResponseUpdated(updateResponseDto)
  @Patch('/update/:id')
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

      res.status(HttpStatus.CREATED).json({
        status: 201,
        message: 'Berhasil Merubah Kriteria',
      });
    } catch (error) {
      console.log(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 500,
        message: 'Internal Server Error',
      });
    }
  }

  @ApiStandartResponseDeleted(deleteResponseDto)
  @Delete('/delete')
  async delete(@Query('id') id: number, @Res() res: Response) {
    try {
      const deleteKriteria = await this.prisma.kriteria.delete({
        where: {
          kriteria_id: id,
        },
      });

      return res.status(HttpStatus.OK).json({
        status: 200,
        message: 'Berhasil Menghapus Kriteria',
        data: {},
      });
    } catch (error) {
      console.log(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 500,
        message: 'Internal Server Error',
      });
    }
  }
}
