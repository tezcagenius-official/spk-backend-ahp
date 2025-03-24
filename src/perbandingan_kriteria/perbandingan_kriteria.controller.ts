import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { PerbandinganKriteriaService } from './perbandingan_kriteria.service';
import { CreatePerbandinganDto } from './dto/create_perbandingan_dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ApiStandartResponse,
  ApiStandartResponseCreate,
} from 'src/schema_standart/flexibelSchema';
import { createResponseDto } from 'src/auth/dto/response-crud.dto';
import { Response } from 'express';
import {
  CalculateAHPResponseDto,
  PerbandinganKriteriaFilterDto,
} from './dto/response_calculate.dto';
import { PerbandinganKriteriaDto } from './dto/get_perbandingan.dto';
import { ApiBearerAuth } from 'src/common/decorator/bearer_auth';
import { ERole } from 'src/common/enum/ERole';
import { FilterPerbandinganKriteriaDto } from './dto/filter_perbandingan_kriteria.dto';

@ApiTags('Perbandingan Kriteria')
@Controller('/api/perbandingan-kriteria')
export class PerbandinganKriteriaController {
  constructor(
    private readonly perbandinganKriteriaService: PerbandinganKriteriaService,
  ) {}

  @ApiBearerAuth([ERole.ADM])
  @ApiStandartResponse(PerbandinganKriteriaDto)
  @Get('/perbandingan')
  async getPerbandinganKriteria(
    @Query(new ValidationPipe({ transform: true }))
    filter: FilterPerbandinganKriteriaDto,
    @Res() res: Response,
  ) {
    try {
      const result =
        await this.perbandinganKriteriaService.getPerbandinganKriteria(
          filter.divisi_id,
        );

      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: error.getStatus(),
        message: error.getResponse(),
      });
    }
  }

  @ApiBearerAuth([ERole.ADM])
  @ApiStandartResponseCreate(createResponseDto)
  @Post('/perbandingan')
  async createPerbandingan(
    @Body() dto: CreatePerbandinganDto,
    @Res() res: Response,
  ) {
    try {
      if (!dto.divisi_id) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          status: HttpStatus.BAD_REQUEST,
          message: 'divisi_id diperlukan untuk membuat perbandingan',
        });
      }

      const result = await this.perbandinganKriteriaService.createPerbandingan(
        dto,
        dto.divisi_id,
      );

      return res.status(HttpStatus.CREATED).json({
        status: HttpStatus.CREATED,
        message: result.message,
        data: {},
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: error.getStatus(),
        message: error.getResponse(),
      });
    }
  }

  @ApiBearerAuth([ERole.ADM, ERole.SPA])
  @ApiStandartResponse(CalculateAHPResponseDto)
  @Get('/calculate')
  async calculateAHP(
    @Query(new ValidationPipe({ transform: true }))
    filter: PerbandinganKriteriaFilterDto,
    @Res() res: Response,
  ) {
    try {
      if (!filter.divisi_id) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          status: HttpStatus.BAD_REQUEST,
          message: 'divisi_id diperlukan',
        });
      }

      const result = await this.perbandinganKriteriaService.calculateAHP(
        filter.divisi_id,
      );

      // console.log(result);

      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: 'Perbandingan Kriteria',
        data: result,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: error.getStatus(),
        message: error.getResponse(),
      });
    }
  }
}
