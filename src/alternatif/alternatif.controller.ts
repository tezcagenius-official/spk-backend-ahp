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
import { ApiBearerAuth } from 'src/common/decorator/bearer_auth';
import { ERole } from 'src/common/enum/ERole';
import { createPagination } from 'src/common/interface/pagination.util';
import { paginationDekoratorDto } from 'src/common/interface/paginationDekorator';
import { env } from 'process';

@ApiTags('Alternatif')
@Controller('/api/alternatif')
export class AlternatifController {
  constructor(private readonly alternatifService: AlternatifService) {}

  @ApiBearerAuth([ERole.ADM])
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

  @ApiBearerAuth([ERole.ADM, ERole.SPA])
  @ApiStandartResponseArray(ResponseAlternatifDTO)
  @Get()
  async findAll(@Query() filter: paginationDekoratorDto, @Res() res: Response) {
    try {
      const totalCount = await this.alternatifService.countAlternatif();
      const { page, perPage, skip, meta } = createPagination(
        filter,
        totalCount,
      );

      const alternatif = await this.alternatifService.findAlternatif(
        skip,
        perPage,
      );

      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: alternatif.message,
        data: alternatif.alternatif,
        meta: {
          ...meta,
          prev:
            page > 1
              ? `${env.BASE_URL}/api/alternatif?page=${page - 1}&perPage=${perPage}`
              : null,
          next:
            page < meta.lastPage
              ? `${env.BASE_URL}/api/alternatif?page=${page + 1}&perPage=${perPage}`
              : null,
        },
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
      });
    }
  }

  @ApiBearerAuth([ERole.ADM, ERole.SPA])
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

  @ApiBearerAuth([ERole.ADM])
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

  @ApiBearerAuth([ERole.ADM])
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
