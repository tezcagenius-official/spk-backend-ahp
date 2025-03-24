import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePerbandinganDto } from './dto/create_perbandingan_dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class PerbandinganKriteriaService {
  constructor(private prisma: PrismaService) {}

  async getPerbandinganKriteria(divisi_id: number) {
    const divisi = await this.prisma.divisi.findFirst({
      where: {
        divisi_id: divisi_id,
      },
    });

    if (!divisi) {
      return {
        message: `Divisi Tidak Ditemukan`,
      };
    }

    const kriteria = await this.prisma.kriteria.findMany({
      where: {
        divisi_id: divisi_id,
      },
    });

    if (kriteria.length === 0) {
      return {
        message: `Belum Ada Kriteria Pada Divisi ${divisi.nama_divisi}`,
      };
    }

    const combinations = [];
    for (let i = 0; i < kriteria.length; i++) {
      for (let j = i + 1; j < kriteria.length; j++) {
        combinations.push({
          kriteria1_id: kriteria[i].kriteria_id,
          kriteria2_id: kriteria[j].kriteria_id,
          nilai_perbandingan: 1,
        });
      }
    }

    return {
      data: {
        divisi_id: divisi.divisi_id,
        perbandingan: combinations,
      },
      message: `Perbandingan kriteria Divisi ${divisi.nama_divisi}`,
    };
  }

  async createPerbandingan(dto: CreatePerbandinganDto, divisi_id: number) {
    const { perbandingan } = dto;

    const kriteriaInDivisi = await this.prisma.kriteria.findMany({
      where: { divisi_id },
      select: { kriteria_id: true },
    });

    const kriteriaIds = new Set(kriteriaInDivisi.map((k) => k.kriteria_id));

    const filteredPerbandingan = perbandingan.filter(
      (item) =>
        kriteriaIds.has(item.kriteria1_id) &&
        kriteriaIds.has(item.kriteria2_id),
    );

    if (filteredPerbandingan.length === 0) {
      return { message: `Tidak ada kriteria yang valid untuk divisi ini.` };
    }

    const uniqueKriteriaIds = Array.from(kriteriaIds);
    uniqueKriteriaIds.forEach((kriteriaId) => {
      filteredPerbandingan.push({
        kriteria1_id: kriteriaId,
        kriteria2_id: kriteriaId,
        nilai_perbandingan: 1,
      });
    });

    await Promise.all(
      filteredPerbandingan.map(
        async ({ kriteria1_id, kriteria2_id, nilai_perbandingan }) => {
          await this.prisma.perbandingan_kriteria.upsert({
            where: {
              kriteria1_id_kriteria2_id: { kriteria1_id, kriteria2_id },
            },
            update: { nilai_perbandingan },
            create: { kriteria1_id, kriteria2_id, nilai_perbandingan },
          });

          await this.prisma.perbandingan_kriteria.upsert({
            where: {
              kriteria1_id_kriteria2_id: {
                kriteria1_id: kriteria2_id,
                kriteria2_id: kriteria1_id,
              },
            },
            update: { nilai_perbandingan: 1 / nilai_perbandingan },
            create: {
              kriteria1_id: kriteria2_id,
              kriteria2_id: kriteria1_id,
              nilai_perbandingan: 1 / nilai_perbandingan,
            },
          });
        },
      ),
    );

    return {
      message: `Perbandingan kriteria untuk divisi ${divisi_id} berhasil disimpan.`,
    };
  }

  async calculateAHP(divisi_id: number) {
    //  kriteria by divisi_id
    const kriteria = await this.prisma.kriteria.findMany({
      where: { divisi_id },
    });
    const jumlahKriteria = kriteria.length;

    if (jumlahKriteria === 0) {
      return {
        message: 'Tidak ada kriteria untuk divisi ini.',
        matriks: [],
        matriksNormalisasi: [],
        prioritas: [],
        eigenMax: 0,
        CI: 0,
        RI: 0,
        CR: 0,
        konsisten: false,
      };
    }

    // perbandingan by divisi_id
    const kriteriaIds = kriteria.map((k) => k.kriteria_id);

    const perbandingan = await this.prisma.perbandingan_kriteria.findMany({
      where: {
        kriteria1_id: { in: kriteriaIds },
        kriteria2_id: { in: kriteriaIds },
      },
    });

    // Inisialisasi matriks perbandingan
    const matriks: number[][] = Array.from({ length: jumlahKriteria }, (_, i) =>
      Array.from({ length: jumlahKriteria }, (_, j) => (i === j ? 1 : 0)),
    );

    perbandingan.forEach((p) => {
      const i = kriteria.findIndex((k) => k.kriteria_id === p.kriteria1_id);
      const j = kriteria.findIndex((k) => k.kriteria_id === p.kriteria2_id);

      if (i !== -1 && j !== -1) {
        const nilaiPerbandingan = (p.nilai_perbandingan as Decimal).toNumber();
        matriks[i][j] = nilaiPerbandingan;
        matriks[j][i] = 1 / nilaiPerbandingan;
      }
    });

    // Hitung total kolom
    const totalKolom = matriks[0].map((_, colIndex) =>
      matriks.reduce((sum, row) => sum + row[colIndex], 0),
    );

    // Normalisasi matriks
    const matriksNormalisasi = matriks.map((row) =>
      row.map((value, colIndex) =>
        totalKolom[colIndex] === 0 ? 0 : value / totalKolom[colIndex],
      ),
    );

    // Hitung prioritas
    const prioritas = matriksNormalisasi.map(
      (row) => row.reduce((sum, value) => sum + value, 0) / jumlahKriteria,
    );

    if (prioritas.some((p) => isNaN(p) || p === null)) {
      return {
        message: 'Data perbandingan tidak konsisten atau tidak lengkap.',
        matriks,
        matriksNormalisasi,
        prioritas,
      };
    }

    // Hitung nilai eigen
    const eigenValues = totalKolom.map((total, i) => prioritas[i] * total);
    const eigenMax = eigenValues.reduce((sum, value) => sum + value, 0);

    const CI = (eigenMax - jumlahKriteria) / (jumlahKriteria - 1);
    const RI = getRI(jumlahKriteria);
    const CR = RI === 0 ? null : CI / RI;

    await Promise.all(
      kriteria.map((k, index) =>
        this.prisma.kriteria.update({
          where: { kriteria_id: k.kriteria_id },
          data: { prioritas: prioritas[index] },
        }),
      ),
    );

    return {
      matriks: matriks.map((row) =>
        row.map((value) => parseFloat(value.toFixed(3))),
      ),
      matriksNormalisasi: matriksNormalisasi.map((row) =>
        row.map((value) => parseFloat(value.toFixed(3))),
      ),
      prioritas: prioritas.map((value) => parseFloat(value.toFixed(3))),
      eigenMax: parseFloat(eigenMax.toFixed(3)),
      CI: parseFloat(CI.toFixed(3)),
      RI: parseFloat(RI.toFixed(3)),
      CR: parseFloat(CR.toFixed(3)),
      konsisten: CR !== null && CR < 0.1, // Jika < 0.1 maka konsisten
    };
  }
}

// nilai RI
function getRI(jumlahKriteria: number): number {
  const riTable: Record<number, number> = {
    1: 0.0,
    2: 0.0,
    3: 0.58,
    4: 0.9,
    5: 1.12,
    6: 1.24,
    7: 1.32,
    8: 1.41,
    9: 1.45,
    10: 1.49,
  };
  return riTable[jumlahKriteria] || 0;
}
