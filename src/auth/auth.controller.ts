import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';
import { ApiStandartResponse } from 'src/schema_standart/flexibelSchema';
import { tokenResponse } from 'src/schema_standart/tokenResponse';
import { AuthGuard } from 'src/middleware/AuthGuard.middleware';
import { ERole } from 'src/common/enum/ERole';
import { ApiBearerAuth } from 'src/common/decorator/bearer_auth';

@ApiTags('Auth')
@Controller('/api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  @ApiStandartResponse(tokenResponse)
  @Post('/login')
  async login(@Body() dto: AuthDto, @Res() res: Response) {
    let token: string;
    try {
      const users = await this.prisma.users.findFirst({
        where: {
          username: dto.username,
        },
      });

      if (!users) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          status: 400,
          message: 'Username Tidak Terdaftar',
        });
      } else {
        const payload = {
          user_id: users.user_id,
          username: users.username,
          role: users.role,
        };

        const check = await this.CheckPassword(dto.password, users?.password);

        if (!check) {
          return res.status(HttpStatus.BAD_REQUEST).json({
            status: 400,
            message: 'Password Salah',
          });
        } else {
          const tokenCreate = await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_SECRET_KEY,
            expiresIn: '7d',
          });

          token = tokenCreate;
        }
      }
      return res.status(HttpStatus.OK).json({
        status: 200,
        message: 'ok',
        data: { token, users },
      });
    } catch (error) {
      console.log(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 500,
        message: 'Internal Server Error',
      });
    }
  }

  async CheckPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    try {
      const isMatch = await bcrypt.compare(password, hashedPassword);
      return isMatch;
    } catch (error) {
      return false;
    }
  }

  // @ApiBearerAuth([ERole.ADM, ERole.SPA])
  // @Get('/tes')
  // async tes(@Res() res: Response) {
  //   try {
  //     res.status(HttpStatus.OK).json({
  //       status: 200,
  //       message: 'dapat dapat',
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
  //       status: 500,
  //       message: 'Internal Server Error',
  //     });
  //   }
  // }
}
