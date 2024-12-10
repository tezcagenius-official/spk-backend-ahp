import { Injectable } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PerhitunganService {
  constructor(private prisma: PrismaService) {}

  // async upsertPenilaianAlternatif(payload: {
  //   alternatifId: number;
  //   penilaian: { kriteriaId: number; subKriteriaId: number }[];
  // }) {
  //   const { alternatifId, penilaian } = payload;

  //   // Ambil data sub-kriteria dan prioritas
  //   const subKriteriaIds = penilaian.map((p) => p.subKriteriaId);
  //   const subKriteria = await this.prisma.sub_kriteria.findMany({
  //     where: { sub_kriteria_id: { in: subKriteriaIds } },
  //     select: {
  //       sub_kriteria_id: true,
  //       prioritas: true,
  //     },
  //   });

  //   // Buat map untuk mencocokkan sub_kriteria_id dengan prioritas
  //   const subKriteriaMap = new Map(
  //     subKriteria.map((sk) => [sk.sub_kriteria_id, sk.prioritas]),
  //   );

  //   // Ambil prioritas kriteria
  //   const kriteriaIds = penilaian.map((p) => p.kriteriaId);
  //   const kriteria = await this.prisma.kriteria.findMany({
  //     where: { kriteria_id: { in: kriteriaIds } },
  //     select: {
  //       kriteria_id: true,
  //       prioritas: true,
  //     },
  //   });

  //   // Buat map untuk mencocokkan kriteria_id dengan prioritas
  //   const kriteriaMap = new Map(
  //     kriteria.map((k) => [k.kriteria_id, k.prioritas]),
  //   );

  //   // Proses data untuk disimpan ke penilaian_alternatif (upsert)
  //   for (const p of penilaian) {
  //     const nilai_sub_kriteria =
  //       ((subKriteriaMap.get(p.subKriteriaId)?.toNumber() || 0) *
  //         (kriteriaMap.get(p.kriteriaId)?.toNumber() || 0)) || 0;

  //     await this.prisma.penilaian_alternatif.upsert({
  //       where: {
  //         alternatif_id_kriteria_id_sub_kriteria_id: {
  //           alternatif_id: alternatifId,
  //           kriteria_id: p.kriteriaId,
  //           sub_kriteria_id: p.subKriteriaId,
  //         },
  //       },
  //       update: {
  //         nilai_sub_kriteria,
  //       },
  //       create: {
  //         alternatif_id: alternatifId,
  //         kriteria_id: p.kriteriaId,
  //         sub_kriteria_id: p.subKriteriaId,
  //         nilai_sub_kriteria,
  //       },
  //     });
  //   }

  //   // Hitung total skor untuk alternatif
  //   const totalSkor = dataToUpsert.reduce(
  //     (total, item) => total + item.nilai_sub_kriteria,
  //     0,
  //   );

  //   // Update total skor pada tabel alternatif
  //   await this.prisma.alternatif.update({
  //     where: { alternatif_id: alternatifId },
  //     data: { total_skor: new Decimal(totalSkor) },
  //   });

  //   // Mengambil semua alternatif dan mengurutkannya berdasarkan total skor
  //   const peringkat = await this.prisma.alternatif.findMany({
  //     orderBy: { total_skor: 'desc' },
  //   });

  //   // Update peringkat pada setiap alternatif
  //   const updatedPeringkat = peringkat.map((alt, index) => ({
  //     alternatifId: alt.alternatif_id,
  //     peringkat: index + 1,
  //     totalSkor: alt.total_skor.toNumber(),
  //   }));

  //   return {
  //     message: 'Penilaian alternatif berhasil disimpan dan hasil dihitung.',
  //     upsertedRecords,
  //     totalSkor,
  //     peringkat: updatedPeringkat,
  //   };
  // }

  // async findAll() {
  //   try {
  //     const penilaian = await this.prisma.penilaian_alternatif.findMany({
  //       include: {
  //         alternatif: {
  //           select: {
  //             nama: true,
  //           },
  //         },
  //         kriteria: {
  //           select: {
  //             nama_kriteria: true,
  //           },
  //         },
  //         sub_kriteria: {
  //           select: {
  //             nama_sub_kriteria: true,
  //           },
  //         },
  //       },
  //     });

  //     return {
  //       penilaian,
  //       message: 'Berhasil Mengambil Data Penilaian',
  //     };
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}
