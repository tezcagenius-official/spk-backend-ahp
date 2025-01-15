import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Res,
} from '@nestjs/common';
import { PerbandinganSubKriteriaService } from './perbandingan_sub_kriteria.service';
import { CreateSubKriteriaPerbandinganDto } from './dto/create_perbandingan_sub_kriteria.dto';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import {
  ApiStandartResponse,
  ApiStandartResponseCreate,
} from 'src/schema_standart/flexibelSchema';
import { createResponseDto } from 'src/auth/dto/response-crud.dto';
import { CalculateSubKriteriaAHPResponseDto } from './dto/response_perbandingan_sub_kriteria.dto';
import { PerbandinganSubKriteriaDto } from './dto/get_perbandingan_sub_kriteria.dto';
import { ApiBearerAuth } from 'src/common/decorator/bearer_auth';
import { ERole } from 'src/common/enum/ERole';

@ApiTags('Perbandingan Sub Kriteria')
@Controller('/api/perbandingan-sub')
export class PerbandinganSubKriteriaController {
  constructor(
    private readonly perbandinganSubKriteriaService: PerbandinganSubKriteriaService,
  ) {}

  @ApiBearerAuth([ERole.ADM])
  @ApiStandartResponse(PerbandinganSubKriteriaDto)
  @Get('/perbandingan/:kriteria_id')
  async getSubKriteriaCombinationsDefault(
    @Param('kriteria_id', ParseIntPipe) kriteria_id: number,
    @Res() res: Response,
  ) {
    try {
      const result =
        await this.perbandinganSubKriteriaService.getSubKriteriaCombinationsDefault(
          kriteria_id,
        );

      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: `Perbandingan sub-kriteria kriteria ID ${kriteria_id}.`,
        data: result,
      });
    } catch (error) {
      return res
        .status(
          error instanceof BadRequestException
            ? HttpStatus.BAD_REQUEST
            : HttpStatus.INTERNAL_SERVER_ERROR,
        )
        .json({
          status: HttpStatus.BAD_REQUEST,
          message: error.message,
        });
    }
  }

  @ApiBearerAuth([ERole.ADM])
  @ApiStandartResponseCreate(createResponseDto)
  @Post('/perbandingan')
  async createPerbandinganSubKriteria(
    @Body() data: CreateSubKriteriaPerbandinganDto,
    @Res() res: Response,
  ) {
    try {
      const result =
        await this.perbandinganSubKriteriaService.createPerbandinganSubKriteria(
          data,
        );
      return res.status(HttpStatus.CREATED).json({
        status: HttpStatus.CREATED,
        message: result.message,
        data: {},
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }

  @ApiBearerAuth([ERole.ADM, ERole.SPA])
  @ApiStandartResponse(CalculateSubKriteriaAHPResponseDto)
  @Get('calculate-sub/:kriteria_id')
  async calculateSubKriteria(
    @Param('kriteria_id', ParseIntPipe) kriteria_id: number,
    @Res() res: Response,
  ) {
    try {
      const result =
        await this.perbandinganSubKriteriaService.calculateSubKriteria(
          kriteria_id,
        );

      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: `Perbandingan Sub-Kriteria, Kriteria ID ${kriteria_id}`,
        data: result,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Terjadi kesalahan saat menghitung Sub-Kriteria',
        error: error.message,
      });
    }
  }
}
