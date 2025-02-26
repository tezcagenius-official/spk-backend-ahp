import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSubKriteriaPerbandinganDto } from './dto/create_perbandingan_sub_kriteria.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class PerbandinganSubKriteriaService {
  constructor(private prisma: PrismaService) {}

  async getSubKriteriaCombinationsDefault(kriteria_id: number) {
    const subKriteria = await this.prisma.sub_kriteria.findMany({
      where: { kriteria_id },
      select: { sub_kriteria_id: true },
    });

    if (subKriteria.length < 2) {
      throw new BadRequestException(
        `Tidak cukup sub-kriteria untuk membuat kombinasi pada kriteria ID ${kriteria_id}.`,
      );
    }

    const combinations = [];
    for (let i = 0; i < subKriteria.length; i++) {
      for (let j = i + 1; j < subKriteria.length; j++) {
        combinations.push({
          sub_kriteria1_id: subKriteria[i].sub_kriteria_id,
          sub_kriteria2_id: subKriteria[j].sub_kriteria_id,
          nilai_perbandingan: 1,
        });
      }
    }

    return {
      kriteria_id,
      perbandingan: combinations,
    };
  }

  async createPerbandinganSubKriteria(data: CreateSubKriteriaPerbandinganDto) {
    const { kriteria_id, perbandingan } = data;

    const kriteria = await this.prisma.kriteria.findUnique({
      where: { kriteria_id },
    });

    if (!kriteria) {
      throw new NotFoundException(
        `Kriteria dengan ID ${kriteria_id} tidak ditemukan.`,
      );
    }

    const subKriteriaIds = await this.prisma.sub_kriteria.findMany({
      where: { kriteria_id },
      select: { sub_kriteria_id: true },
    });

    const validSubKriteriaIds = subKriteriaIds.map((sk) => sk.sub_kriteria_id);

    const invalidPairs = perbandingan.filter(
      (p) =>
        !validSubKriteriaIds.includes(p.sub_kriteria1_id) ||
        !validSubKriteriaIds.includes(p.sub_kriteria2_id),
    );

    if (invalidPairs.length > 0) {
      throw new BadRequestException(
        `Sub-kriteria berikut tidak valid untuk kriteria ID ${kriteria_id}: ${JSON.stringify(
          invalidPairs,
        )}`,
      );
    }

    for (const p of perbandingan) {
      await this.prisma.perbandingan_sub_kriteria.upsert({
        where: {
          kriteria1_kriteria2: {
            kriteria_id,
            sub_kriteria1_id: p.sub_kriteria1_id,
            sub_kriteria2_id: p.sub_kriteria2_id,
          },
        },
        update: {
          nilai_perbandingan: p.nilai_perbandingan,
        },
        create: {
          kriteria_id,
          sub_kriteria1_id: p.sub_kriteria1_id,
          sub_kriteria2_id: p.sub_kriteria2_id,
          nilai_perbandingan: p.nilai_perbandingan,
        },
      });

      await this.prisma.perbandingan_sub_kriteria.upsert({
        where: {
          kriteria1_kriteria2: {
            kriteria_id,
            sub_kriteria1_id: p.sub_kriteria2_id,
            sub_kriteria2_id: p.sub_kriteria1_id,
          },
        },
        update: {
          nilai_perbandingan: 1 / p.nilai_perbandingan,
        },
        create: {
          kriteria_id,
          sub_kriteria1_id: p.sub_kriteria2_id,
          sub_kriteria2_id: p.sub_kriteria1_id,
          nilai_perbandingan: 1 / p.nilai_perbandingan,
        },
      });
    }

    for (const id of validSubKriteriaIds) {
      await this.prisma.perbandingan_sub_kriteria.upsert({
        where: {
          kriteria1_kriteria2: {
            kriteria_id,
            sub_kriteria1_id: id,
            sub_kriteria2_id: id,
          },
        },
        update: {
          nilai_perbandingan: 1,
        },
        create: {
          kriteria_id,
          sub_kriteria1_id: id,
          sub_kriteria2_id: id,
          nilai_perbandingan: 1,
        },
      });
    }

    return {
      message: `Perbandingan sub-kriteria, kriteria ID ${kriteria_id}.`,
    };
  }

  async calculateSubKriteria(kriteria_id: number) {
    const subKriteria = await this.prisma.sub_kriteria.findMany({
      where: { kriteria_id },
    });
    const jumlahSubKriteria = subKriteria.length;

    const perbandingan = await this.prisma.perbandingan_sub_kriteria.findMany({
      where: { kriteria_id },
    });

    const matriks: number[][] = Array.from(
      { length: jumlahSubKriteria },
      (_, i) =>
        Array.from({ length: jumlahSubKriteria }, (_, j) => (i === j ? 1 : 0)),
    );

    perbandingan.forEach((p) => {
      const i = subKriteria.findIndex(
        (sk) => sk.sub_kriteria_id === p.sub_kriteria1_id,
      );
      const j = subKriteria.findIndex(
        (sk) => sk.sub_kriteria_id === p.sub_kriteria2_id,
      );

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

    const prioritas = matriksNormalisasi.map(
      (row) => row.reduce((sum, value) => sum + value, 0) / jumlahSubKriteria,
    );

    if (prioritas.some((p) => isNaN(p) || p === null)) {
      return {
        message:
          'Data perbandingan sub-kriteria tidak konsisten atau tidak lengkap.',
        matriks,
        matriksNormalisasi,
        prioritas,
      };
    }

    const eigenValues = totalKolom.map((total, i) => prioritas[i] * total);
    const eigenMax = eigenValues.reduce((sum, value) => sum + value, 0);

    const CI = (eigenMax - jumlahSubKriteria) / (jumlahSubKriteria - 1);
    const RI = getRI(jumlahSubKriteria);
    const CR = RI === 0 ? null : CI / RI;

    // Update atau simpan nilai prioritas ke tabel `sub_kriteria`
    await Promise.all(
      subKriteria.map((sk, index) =>
        this.prisma.sub_kriteria.update({
          where: { sub_kriteria_id: sk.sub_kriteria_id },
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

  async getSubKriteriaPerbandingan(kriteria_id: number) {
    try {
      const sub = await this.prisma.sub_kriteria.findMany({
        where: {
          kriteria_id,
        },
        select: {
          kriteria_id: true,
          nama_sub_kriteria: true,
        },
      });

      return {
        sub,
        message: 'sub Kriteria Berhasil Diambil',
      };
    } catch (error) {
      throw error;
    }
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
