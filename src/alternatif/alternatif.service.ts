import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAlternatifDTO } from './dto/create_alternatif.dto';

@Injectable()
export class AlternatifService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateAlternatifDTO) {
    try {
      const create = await this.prisma.alternatif.create({
        data: {
          nama: data.nama,
          email: data.email,
          nomor_telpon: data.nomor_telpon,
        },
      });

      return {
        message: 'Berhasil Menambahkan Alternatif',
      };
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      const alternatif = await this.prisma.alternatif.findMany();

      return {
        alternatif,
        message: 'Berhasil Mengambil Data Alternatif',
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(alternatif_id: number) {
    try {
      const alternatif = await this.prisma.alternatif.findFirst({
        where: {
          alternatif_id: alternatif_id,
        },
      });

      return {
        alternatif,
        message: 'Berhasil Mengambil Data Alternatif',
      };
    } catch (error) {
      throw error;
    }
  }

  async update(alternatif_id: number, data: CreateAlternatifDTO) {
    try {
      const update = await this.prisma.alternatif.update({
        where: {
          alternatif_id: alternatif_id,
        },
        data: {
          nama: data.nama,
          email: data.email,
          nomor_telpon: data.nomor_telpon,
        },
      });

      return {
        message: 'Berhasil Merubah Alternatif',
      };
    } catch (error) {
      throw error;
    }
  }

  async delete(alternatif_id: number) {
    try {
      const destroy = await this.prisma.alternatif.delete({
        where: {
          alternatif_id: alternatif_id,
        },
      });

      return {
        message: 'Berhasil Menghapus Alternatif',
      };
    } catch (error) {
      throw error;
    }
  }
}
