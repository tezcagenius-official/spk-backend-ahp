import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { RegisterUserDto } from './dto/create_user.dto';
import { Response } from 'express';
import {
  ApiStandartResponseArray,
  ApiStandartResponseCreate,
  ApiStandartResponseDeleted,
} from 'src/schema_standart/flexibelSchema';
import {
  createResponseDto,
  deleteResponseDto,
} from 'src/auth/dto/response-crud.dto';
import { paginationDekoratorDto } from 'src/common/interface/paginationDekorator';
import { createPagination } from 'src/common/interface/pagination.util';
import { ResponseUserDTO } from './dto/response_user.dto';
import { ApiBearerAuth } from 'src/common/decorator/bearer_auth';
import { ERole } from 'src/common/enum/ERole';
import { env } from 'process';

@ApiTags('Users')
@Controller('/api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth([ERole.SPA])
  @ApiStandartResponseCreate(createResponseDto)
  @Post()
  async create(@Body() dto: RegisterUserDto, @Res() res: Response) {
    try {
      const create = await this.usersService.create(dto);

      return res.status(HttpStatus.CREATED).json({
        status: HttpStatus.CREATED,
        message: create.message,
        data: {},
      });
    } catch (error) {
      console.error('Error in creating user:', error);

      if (error.response) {
        return res.status(error.getStatus()).json({
          status: error.getStatus(),
          message: error.response.message,
        });
      }

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
      });
    }
  }

  @ApiBearerAuth([ERole.SPA])
  @ApiStandartResponseArray(ResponseUserDTO)
  @Get()
  async findAll(@Query() filter: paginationDekoratorDto, @Res() res: Response) {
    try {
      const totalCount = await this.usersService.countAlternatif();
      const { page, perPage, skip, meta } = createPagination(
        filter,
        totalCount,
      );

      const user = await this.usersService.findAll(skip, perPage);

      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: user.message,
        data: user.users,
        meta: {
          ...meta,
          prev:
            page > 1
              ? `${env.BASE_URL}/api/users?page=${page - 1}&perPage=${perPage}`
              : null,
          next:
            page < meta.lastPage
              ? `${env.BASE_URL}/api/users?page=${page + 1}&perPage=${perPage}`
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

  @ApiBearerAuth([ERole.SPA])
  @ApiStandartResponseDeleted(deleteResponseDto)
  @Delete('/:user_id')
  async delete(@Param('user_id') user_id: number, @Res() res: Response) {
    try {
      const result = await this.usersService.delete(user_id);

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
