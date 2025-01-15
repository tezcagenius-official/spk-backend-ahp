import { Injectable } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PerhitunganService {
  constructor(private prisma: PrismaService) {}

  async getAlternatifById(alternatif_id: number) {
    try {
      const alternatif = await this.prisma.alternatif.findUnique({
        where: { alternatif_id: alternatif_id },
      });

      if (!alternatif) {
        throw new Error('Alternatif tidak ditemukan.');
      }

      const kriteria = await this.prisma.kriteria.findMany({
        include: {
          sub_kriteria: true,
        },
      });

      return {
        message: 'Berhasil mengambil data alternatif dan kriteria.',
        data: {
          alternatif,
          kriteria,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async upsertPenilaianAlternatif(payload: {
    alternatif_id: number;
    penilaian: { kriteria_id: number; sub_kriteria_id: number }[];
  }) {
    try {
      const { alternatif_id, penilaian } = payload;

      return this.prisma.$transaction(async (prisma) => {
        const sub_kriteria_ids = penilaian.map((p) => p.sub_kriteria_id);
        const subKriteria = await prisma.sub_kriteria.findMany({
          where: { sub_kriteria_id: { in: sub_kriteria_ids } },
          select: {
            sub_kriteria_id: true,
            prioritas: true,
          },
        });

        const subKriteriaMap = new Map(
          subKriteria.map((sk) => [sk.sub_kriteria_id, sk.prioritas]),
        );

        const kriteria_ids = penilaian.map((p) => p.kriteria_id);
        const kriteria = await prisma.kriteria.findMany({
          where: { kriteria_id: { in: kriteria_ids } },
          select: {
            kriteria_id: true,
            prioritas: true,
          },
        });

        const kriteriaMap = new Map(
          kriteria.map((k) => [k.kriteria_id, k.prioritas]),
        );

        const dataToUpsert = [];

        for (const p of penilaian) {
          const nilai_sub_kriteria =
            (subKriteriaMap.get(p.sub_kriteria_id)?.toNumber() || 0) *
              (kriteriaMap.get(p.kriteria_id)?.toNumber() || 0) || 0;

          dataToUpsert.push({
            alternatif_id: alternatif_id,
            kriteria_id: p.kriteria_id,
            sub_kriteria_id: p.sub_kriteria_id,
            nilai_sub_kriteria,
          });

          await prisma.penilaian_alternatif.upsert({
            where: {
              alternatif_id_kriteria_id: {
                alternatif_id: alternatif_id,
                kriteria_id: p.kriteria_id,
              },
            },
            update: {
              sub_kriteria_id: p.sub_kriteria_id,
              nilai_sub_kriteria,
            },
            create: {
              alternatif_id: alternatif_id,
              kriteria_id: p.kriteria_id,
              sub_kriteria_id: p.sub_kriteria_id,
              nilai_sub_kriteria,
            },
          });
        }

        const totalSkor = dataToUpsert.reduce(
          (total, item) => total + item.nilai_sub_kriteria,
          0,
        );

        let peringkat = await prisma.hasil_perhitungan.findMany({
          orderBy: { total_skor: 'desc' },
          select: {
            id: true,
            alternatif_id: true,
            total_skor: true,
          },
        });

        if (peringkat.length === 0) {
          console.log('Tabel kosong, memasukkan data baru.');
          await prisma.hasil_perhitungan.create({
            data: {
              alternatif_id: dataToUpsert[0].alternatif_id,
              total_skor: totalSkor,
              ranking: 1,
            },
          });

          peringkat = await prisma.hasil_perhitungan.findMany({
            orderBy: { total_skor: 'desc' },
            select: {
              id: true,
              alternatif_id: true,
              total_skor: true,
            },
          });
        } else {
          const existingData = peringkat.find(
            (p) => p.alternatif_id === dataToUpsert[0].alternatif_id,
          );

          if (existingData) {
            await prisma.hasil_perhitungan.update({
              where: { id: existingData.id },
              data: {
                total_skor: totalSkor,
                ranking:
                  peringkat.findIndex((p) => p.id === existingData.id) + 1,
              },
            });
          } else {
            await prisma.hasil_perhitungan.create({
              data: {
                alternatif_id: dataToUpsert[0].alternatif_id,
                total_skor: totalSkor,
                ranking: 1,
              },
            });

            peringkat = await prisma.hasil_perhitungan.findMany({
              orderBy: { total_skor: 'desc' },
              select: {
                id: true,
                alternatif_id: true,
                total_skor: true,
              },
            });
          }
        }

        peringkat.sort((a, b) => {
          const skorA = a.total_skor ? a.total_skor.toNumber() : 0;
          const skorB = b.total_skor ? b.total_skor.toNumber() : 0;
          return skorB - skorA;
        });

        for (const [index, alt] of peringkat.entries()) {
          // console.log('Upserting data:', {
          //   id: alt.id,
          //   alternatif_id: alt.alternatif_id,
          //   total_skor: alt.total_skor,
          //   ranking: index + 1,
          // });

          await prisma.hasil_perhitungan.update({
            where: {
              id: alt.id,
            },
            data: {
              total_skor: alt.total_skor,
              ranking: index + 1,
            },
          });
        }

        return {
          message: 'Penilaian alternatif sukses',
          totalSkor,
        };
      });
    } catch (error) {
      console.error('Transaction error:', error);
      throw error;
    }
  }

  async countAlternatif() {
    return this.prisma.hasil_perhitungan.count();
  }

  async hasilPerhitungan(skip: number, take: number) {
    try {
      const result = await this.prisma.hasil_perhitungan.findMany({
        select: {
          alternatif: {
            select: {
              nama: true,
              email: true,
              nomor_telpon: true,
              penilaian_alternatif: {
                select: {
                  nilai_sub_kriteria: true,
                  sub_kriteria: true,
                  kriteria: true,
                },
              },
            },
          },
          id: true,
          total_skor: true,
          ranking: true,
        },
        orderBy: {
          ranking: 'asc',
        },
        skip,
        take,
      });

      const filteredResult = result.map((item) => ({
        nama: item.alternatif.nama,
        email: item.alternatif.email,
        nomor_telpon: item.alternatif.nomor_telpon,
        nilai: item.alternatif.penilaian_alternatif.map((penilaian) => ({
          kriteria: penilaian.kriteria?.nama_kriteria,
          sub_kriteria: penilaian.sub_kriteria?.nama_sub_kriteria,
          nilai: penilaian.nilai_sub_kriteria,
        })),
        total_skor: item.total_skor,
        ranking: item.ranking,
      }));

      return {
        filteredResult,
        message: 'Berhasil Mengambil Hasil Perhitungan',
      };
    } catch (error) {
      console.log(error);

      throw error;
    }
  }
}
