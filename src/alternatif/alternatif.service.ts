import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAlternatifDTO } from './dto/create_alternatif.dto';
import { EditAlternatifDTO } from './dto/edit_alternatif.dto';

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
          divisi_id: data.divisi_id,
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

  async findAlternatif(skip: number, take: number, divisi_id?: number) {
    try {
      const whereCondition = divisi_id ? { divisi_id } : {};

      const alternatif = await this.prisma.alternatif.findMany({
        where: {
          divisi: whereCondition, // 🔹 Filter berdasarkan divisi jika ada
        },
        select: {
          alternatif_id: true,
          nama: true,
          email: true,
          nomor_telpon: true,
          divisi: {
            select: {
              divisi_id: true,
              nama_divisi: true,
            },
          },
        },
        skip,
        take,
      });

      const result = alternatif.map((item) => ({
        alternatif_id: item.alternatif_id,
        nama: item.nama,
        email: item.email,
        nomor_telpon: item.nomor_telpon,
        divisi_id: item.divisi.divisi_id,
        nama_divisi: item.divisi.nama_divisi,
      }));

      return {
        result,
        message: alternatif.length
          ? 'Berhasil Mengambil Data Alternatif'
          : 'Data belum ada',
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
        select: {
          alternatif_id: true,
          nama: true,
          email: true,
          nomor_telpon: true,
          divisi: {
            select: {
              divisi_id: true,
              nama_divisi: true,
            },
          },
        },
      });

      const result = {
        alternatif_id: alternatif.alternatif_id,
        nama: alternatif.nama,
        email: alternatif.email,
        nomor_telpon: alternatif.nomor_telpon,
        divisi_id: alternatif.divisi.divisi_id,
        nama_divisi: alternatif.divisi.nama_divisi,
      };

      return {
        result,
        message: 'Berhasil Mengambil Data Alternatif',
      };
    } catch (error) {
      throw error;
    }
  }

  async update(alternatif_id: number, data: EditAlternatifDTO) {
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
