import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';
import * as PdfPrinter from 'pdfmake';

@Injectable()
export class ReportService {
  constructor(private prisma: PrismaService) {}

  async exportToExcel(res: Response) {
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
        total_skor: parseFloat(item.total_skor.toFixed(3)),
        ranking: item.ranking,
      }));

      // Buat workbook dan worksheet
      const workbook = new ExcelJS.Workbook();

      const sheet1 = workbook.addWorksheet('Hasil');
      sheet1.addRow([
        'Nama',
        'Email',
        'Nomor Telepon',
        'Total Skor',
        'Ranking',
      ]);

      filteredResult.forEach((item) => {
        sheet1.addRow([
          item.nama,
          item.email,
          item.nomor_telpon,
          item.total_skor,
          item.ranking,
        ]);
      });

      const sheet2 = workbook.addWorksheet('Hasil Perhitungan Lengkap');
      sheet2.addRow([
        'Nama',
        'Email',
        'Nomor Telepon',
        'Kriteria',
        'Sub Kriteria',
        'Nilai',
        'Total Skor',
        'Ranking',
      ]);

      filteredResult.forEach((item) => {
        item.nilai.forEach((penilaian) => {
          sheet2.addRow([
            item.nama,
            item.email,
            item.nomor_telpon,
            penilaian.kriteria,
            penilaian.sub_kriteria,
            penilaian.nilai,
            item.total_skor,
            item.ranking,
          ]);
        });
      });

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="Hasil Penilaian.xlsx"',
      );

      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
