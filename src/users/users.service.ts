import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterUserDto } from './dto/create_user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: RegisterUserDto) {
    try {
      const cek = await this.prisma.users.findFirst({
        where: {
          username: dto.username,
        },
      });

      if (cek) {
        throw new ConflictException('User sudah terdaftar');
      }

      const hashingPassword = await bcrypt.hash(dto.password, 10);

      const create = await this.prisma.users.create({
        data: {
          ...dto,
          password: hashingPassword,
        },
      });

      return {
        message: 'Berhasil Menambahkan Data User',
      };
    } catch (error) {
      throw error;
    }
  }

  async countAlternatif() {
    return this.prisma.users.count({
      where: {
        role: 'adm',
      },
    });
  }

  async findAll(skip: number, take: number) {
    try {
      const users = await this.prisma.users.findMany({
        select: {
          user_id: true,
          username: true,
          role: true,
        },
        where: {
          role: 'adm',
        },
        skip,
        take,
      });

      return {
        users,
        message: 'Berhasil Mengambil Data User',
      };
    } catch (error) {
      throw error;
    }
  }

  async delete(user_id: number) {
    try {
      const destroy = await this.prisma.users.delete({
        where: {
          user_id: user_id,
        },
      });

      return {
        message: 'Berhasil Menghapus Data User',
      };
    } catch (error) {
      throw error;
    }
  }
}
