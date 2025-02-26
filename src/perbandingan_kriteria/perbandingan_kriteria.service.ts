import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePerbandinganDto } from './dto/create_perbandingan_dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class PerbandinganKriteriaService {
  constructor(private prisma: PrismaService) {}

  async getPerbandinganKriteria() {
    const kriteria = await this.prisma.kriteria.findMany();

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

    return { perbandingan: combinations };
  }

  async createPerbandingan(dto: CreatePerbandinganDto) {
    const { perbandingan } = dto;

    const uniqueKriteriaIds = Array.from(
      new Set([
        ...perbandingan.map((item) => item.kriteria1_id),
        ...perbandingan.map((item) => item.kriteria2_id),
      ]),
    );

    uniqueKriteriaIds.forEach((kriteriaId) => {
      perbandingan.push({
        kriteria1_id: kriteriaId,
        kriteria2_id: kriteriaId,
        nilai_perbandingan: 1,
      });
    });

    await Promise.all(
      perbandingan.map(
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
  }

  async calculateAHP() {
    const kriteria = await this.prisma.kriteria.findMany();
    const jumlahKriteria = kriteria.length;

    const perbandingan = await this.prisma.perbandingan_kriteria.findMany();

    const matriks: number[][] = Array.from({ length: jumlahKriteria }, (_, i) =>
      Array.from({ length: jumlahKriteria }, (_, j) => (i === j ? 1 : 0)),
    );

    perbandingan.forEach((p) => {
      const i = kriteria.findIndex((k) => k.kriteria_id === p.kriteria1_id);
      const j = kriteria.findIndex((k) => k.kriteria_id === p.kriteria2_id);

      const nilaiPerbandingan = (p.nilai_perbandingan as Decimal).toNumber();

      matriks[i][j] = nilaiPerbandingan;
      matriks[j][i] = 1 / nilaiPerbandingan; // Perbandingan terbalik
    });

    const totalKolom = matriks[0].map((_, colIndex) =>
      matriks.reduce((sum, row) => sum + row[colIndex], 0),
    );

    const matriksNormalisasi = matriks.map((row) =>
      row.map((value, colIndex) =>
        totalKolom[colIndex] === 0 ? 0 : value / totalKolom[colIndex],
      ),
    );

    // prioritas
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

    // eigen
    const eigenValues = totalKolom.map((total, i) => prioritas[i] * total);
    const eigenMax = eigenValues.reduce((sum, value) => sum + value, 0);

    // CI, RI, dan CR
    const CI = (eigenMax - jumlahKriteria) / (jumlahKriteria - 1);
    const RI = getRI(jumlahKriteria);
    const CR = RI === 0 ? null : CI / RI;

    // Update atau simpan nilai prioritas ke tabel `kriteria`
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
