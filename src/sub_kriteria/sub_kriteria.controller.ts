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
import { getResponseSubCriteriaDto } from './dto/get_response_sub_kriteria';
import { updateSubKriteriaDto } from './dto/update_sub_kriteria';

@ApiTags('Sub Kriteria')
@Controller('/api/sub-kriteria')
export class SubKriteriaController {
  constructor(
    private readonly subKriteriaService: SubKriteriaService,
    private readonly prisma: PrismaService,
  ) {}
  @ApiStandartResponseCreate(createResponseDto)
  @Post('/create')
  async create(@Body() dto: createSubKriteriaDto, @Res() res: Response) {
    try {
      const create = await this.prisma.sub_kriteria.create({
        data: {
          kriteria_id: dto.kriteria_id,
          nama_sub_kriteria: dto.nama_sub_kriteria,
        },
      });

      res.status(HttpStatus.CREATED).json({
        status: 201,
        message: 'Berhasil Menambahkan Sub Kriteria',
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 500,
        message: 'Internal Server Error',
      });
    }
  }

  @ApiStandartResponseArray(getResponseSubCriteriaDto)
  @Get()
  async findAll(@Res() res: Response) {
    try {
      const subKriteria = await this.prisma.sub_kriteria.findMany();

      return res.status(HttpStatus.OK).json({
        status: 200,
        message: 'Sub Kriteria Berhasil Diambil',
        data: subKriteria,
      });
    } catch (error) {
      console.log(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 500,
        message: 'Internal Server Error',
      });
    }
  }

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

  @ApiStandartResponseUpdated(updateResponseDto)
  @Patch('/update/:id')
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

      res.status(HttpStatus.CREATED).json({
        status: 200,
        message: 'Berhasil Merubah Sub Kriteria',
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
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 500,
        message: 'Internal Server Error',
      });
    }
  }
}
