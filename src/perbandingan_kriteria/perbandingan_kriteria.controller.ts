import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { PerbandinganKriteriaService } from './perbandingan_kriteria.service';
import { CreatePerbandinganDto } from './dto/create_perbandingan_dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ApiStandartResponse,
  ApiStandartResponseCreate,
} from 'src/schema_standart/flexibelSchema';
import { createResponseDto } from 'src/auth/dto/response-crud.dto';
import { Response } from 'express';
import { CalculateAHPResponseDto } from './dto/response_calculate.dto';

@ApiTags('Perbandingan Kriteria')
@Controller('/api/perbandingan-kriteria')
export class PerbandinganKriteriaController {
  constructor(
    private readonly perbandinganKriteriaService: PerbandinganKriteriaService,
  ) {}

  @ApiStandartResponseCreate(createResponseDto)
  @Post('/perbandingan')
  async createPerbandingan(
    @Body() dto: CreatePerbandinganDto,
    @Res() res: Response,
  ) {
    try {
      const result =
        await this.perbandinganKriteriaService.createPerbandingan(dto);

      return res.status(HttpStatus.CREATED).json({
        status: HttpStatus.CREATED,
        message: 'Berhasil Menyimpan Perbandingan',
        data: {},
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: error.getStatus(),
        message: error.getResponse(),
      });
    }
  }

  @ApiStandartResponse(CalculateAHPResponseDto)
  @Get('/calculate')
  async calculateAHP(@Res() res: Response) {
    try {
      const result = await this.perbandinganKriteriaService.calculateAHP();

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
