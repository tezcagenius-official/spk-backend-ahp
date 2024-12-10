import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { AlternatifService } from './alternatif.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateAlternatifDTO } from './dto/create_alternatif.dto';
import { Response } from 'express';
import {
  ApiStandartResponse,
  ApiStandartResponseArray,
  ApiStandartResponseDeleted,
} from 'src/schema_standart/flexibelSchema';
import { ResponseAlternatifDTO } from './dto/response_alternatif.dto';
import { deleteResponseDto } from 'src/auth/dto/response-crud.dto';

@ApiTags('Alternatif')
@Controller('/api/alternatif')
export class AlternatifController {
  constructor(private readonly alternatifService: AlternatifService) {}

  @Post()
  async create(@Body() dto: CreateAlternatifDTO, @Res() res: Response) {
    try {
      const result = await this.alternatifService.create(dto);

      return res.status(HttpStatus.CREATED).json({
        status: HttpStatus.CREATED,
        message: result.message,
        data: {},
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
      });
    }
  }

  @ApiStandartResponseArray(ResponseAlternatifDTO)
  @Get()
  async findAll(@Res() res: Response) {
    try {
      const result = await this.alternatifService.findAll();

      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: result.message,
        data: result.alternatif,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
      });
    }
  }

  @ApiStandartResponse(ResponseAlternatifDTO)
  @Get('/:alternatif_id')
  async findOne(
    @Param('alternatif_id') alternatif_id: number,
    @Res() res: Response,
  ) {
    try {
      const result = await this.alternatifService.findOne(alternatif_id);

      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: result.message,
        data: result.alternatif,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
      });
    }
  }

  @Patch('/:alternatif_id')
  async update(
    @Param('alternatif_id') alternatif_id: number,
    @Body() dto: CreateAlternatifDTO,
    @Res() res: Response,
  ) {
    try {
      const result = await this.alternatifService.update(alternatif_id, dto);

      return res.status(HttpStatus.CREATED).json({
        status: HttpStatus.CREATED,
        message: result.message,
        data: {},
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
      });
    }
  }

  @ApiStandartResponseDeleted(deleteResponseDto)
  @Delete('/:alternatif_id')
  async delete(
    @Param('alternatif_id') alternatif_id: number,
    @Res() res: Response,
  ) {
    try {
      const result = await this.alternatifService.delete(alternatif_id);

      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: result.message,
        data: {},
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
      });
    }
  }
}
