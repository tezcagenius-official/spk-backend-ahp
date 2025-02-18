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

  async countAlternatif() {
    return this.prisma.alternatif.count();
  }

  async findAlternatif(skip: number, take: number) {
    try {
      const alternatif = await this.prisma.alternatif.findMany({
        skip,
        take,
      });

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
      const deletePerhitungan = await this.prisma.hasil_perhitungan.delete({
        where: {
          alternatif_id: alternatif_id,
        },
      });

      const deletePenilaian = await this.prisma.penilaian_alternatif.deleteMany(
        {
          where: {
            alternatif_id: alternatif_id,
          },
        },
      );

      const destroy = await this.prisma.alternatif.delete({
        where: {
          alternatif_id: alternatif_id,
        },
      });

      const peringkat = await this.prisma.hasil_perhitungan.findMany({
        orderBy: { total_skor: 'desc' },
        select: {
          id: true,
          alternatif_id: true,
          total_skor: true,
        },
      });

      // Hitung ulang ranking berdasarkan total_skor
      for (const [index, alt] of peringkat.entries()) {
        await this.prisma.hasil_perhitungan.update({
          where: { id: alt.id },
          data: { ranking: index + 1 }, // Ranking dimulai dari 1
        });
      }

      return {
        message: 'Berhasil Menghapus Alternatif',
      };
    } catch (error) {
      console.log(error);

      throw error;
    }
  }
}
