import { Controller, Get, HttpStatus, Patch, Res } from '@nestjs/common';
import { PerhitunganService } from './perhitungan.service';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/middleware/User';
import { UserPayload } from 'src/middleware/UserPayload';
import { ApiBearerAuth } from 'src/common/decorator/bearer_auth';
import { ERole } from 'src/common/enum/ERole';

@ApiTags('Perhitungan')
@Controller('/api/perhitungan')
export class PerhitunganController {
  constructor(
    private readonly perhitunganService: PerhitunganService,
    private readonly prisma: PrismaService,
  ) {}

  // // hitung nilai preferensi
  // private calculatePreference(a: number, b: number): number {
  //   const diff = a - b;
  //   return diff > 0 ? 1 : 0;
  // }

  // // hitung indeks preferensi
  // private calculateIndexPreference(prefMatrix: number[][]): number[][] {
  //   const n = prefMatrix.length;
  //   const kriteriaCount = 3;
  //   const indexPrefMatrix = Array.from({ length: n }, () => Array(n).fill(0));
  //   for (let i = 0; i < n; i++) {
  //     for (let j = 0; j < n; j++) {
  //       if (i !== j) {
  //         indexPrefMatrix[i][j] = prefMatrix[i][j] / kriteriaCount;
  //       }
  //     }
  //   }
  //   return indexPrefMatrix;
  // }

  // // hitung leaving flow
  // private calculateLeavingFlow(totalIndexPrefMatrix: number[][]): number[] {
  //   const n = totalIndexPrefMatrix.length;

  //   const leavingFlows: number[] = Array(n).fill(0);

  //   for (let i = 0; i < n; i++) {
  //     let leavingFlowSum = 0;

  //     for (let j = 0; j < n; j++) {
  //       if (i !== j) {
  //         leavingFlowSum += totalIndexPrefMatrix[i][j];
  //       }
  //     }

  //     // console.log(leavingFlowSum);

  //     leavingFlows[i] = -1 * (1 / 3 - 1 * leavingFlowSum);
  //   }

  //   return leavingFlows.map((flow) => -flow);
  // }

  // // hitung entering flow
  // private calculateEnteringFlow(totalIndexPrefMatrix: number[][]): number[] {
  //   const n = totalIndexPrefMatrix.length;

  //   const enteringFlows: number[] = Array(n).fill(0);

  //   for (let j = 0; j < n; j++) {
  //     let enteringFlowSum = 0;

  //     for (let i = 0; i < n; i++) {
  //       if (i !== j) {
  //         enteringFlowSum += totalIndexPrefMatrix[i][j];
  //       }
  //     }

  //     // console.log(enteringFlowSum);

  //     enteringFlows[j] = -1 * (1 / 3 - 1 * enteringFlowSum);
  //   }

  //   return enteringFlows.map((flow) => -flow);
  // }

  // // hitung netting flow
  // private calculateNetFlow(
  //   leavingFlows: number[],
  //   enteringFlows: number[],
  // ): number[] {
  //   const n = leavingFlows.length;
  //   const netFlows: number[] = [];

  //   for (let i = 0; i < n; i++) {
  //     netFlows.push(leavingFlows[i] - enteringFlows[i]);
  //   }

  //   return netFlows;
  // }

  // // hitung total index prefrensi
  // private calculateTotalIndexPrefMatrix(
  //   indexPrefMatrices: number[][][],
  // ): number[][] {
  //   const m = indexPrefMatrices.length; // jumlah kriteria
  //   const n = indexPrefMatrices[0][0].length; // jumlah alternatif

  //   const totalIndexPrefMatrix: number[][] = Array.from({ length: n }, () =>
  //     Array(n).fill(0),
  //   );

  //   for (let k = 0; k < m; k++) {
  //     for (let i = 0; i < n; i++) {
  //       for (let j = 0; j < n; j++) {
  //         if (i !== j) {
  //           totalIndexPrefMatrix[i][j] += indexPrefMatrices[k][i][j];
  //         }
  //       }
  //     }
  //   }

  //   return totalIndexPrefMatrix;
  // }

  // // hapus hasil perhitungan lama
  // private async clearPreviousCalculations(prisma: PrismaService) {
  //   await prisma.laporan_hasil_perhitungan.deleteMany();
  //   await prisma.hasil_perhitungan.deleteMany();
  // }

  // // hasil perhitungan baru
  // private async saveCalculationResults(prisma: PrismaService, results: any[]) {
  //   for (const result of results) {
  //     const createdResult = await prisma.hasil_perhitungan.create({
  //       data: result,
  //     });

  //     await prisma.laporan_hasil_perhitungan.create({
  //       data: {
  //         id_perhitungan: createdResult.id_perhitungan,
  //       },
  //     });
  //   }
  // }

  // @ApiBearerAuth([ERole.ADM])
  // @Patch()
  // async calculateRanking(@Res() res: Response) {
  //   try {
  //     const siswaList = await this.prisma.data_siswa.findMany();
  //     const kriteriaList = await this.prisma.data_kriteria.findMany();
  //     const penilaianList = await this.prisma.data_penilaian.findMany();

  //     const nilaiMatrix: { [key: number]: number[][] } = {};

  //     // matriks nilai preferensi
  //     for (const kriteria of kriteriaList) {
  //       nilaiMatrix[kriteria.id_kriteria] = siswaList.map((siswa) =>
  //         siswaList.map((siswa2) => {
  //           const nilai1 =
  //             penilaianList.find(
  //               (p) =>
  //                 p.nisn === siswa.nisn &&
  //                 p.id_kriteria === kriteria.id_kriteria,
  //             )?.bobot || 0;
  //           const nilai2 =
  //             penilaianList.find(
  //               (p) =>
  //                 p.nisn === siswa2.nisn &&
  //                 p.id_kriteria === kriteria.id_kriteria,
  //             )?.bobot || 0;
  //           return this.calculatePreference(nilai1, nilai2);
  //         }),
  //       );
  //     }

  //     const indexPrefMatrix = kriteriaList.map((kriteria) =>
  //       this.calculateIndexPreference(nilaiMatrix[kriteria.id_kriteria]),
  //     );

  //     console.log('indexPrefMatrix');
  //     console.log(indexPrefMatrix);

  //     const totalIndexPrefMatrix =
  //       this.calculateTotalIndexPrefMatrix(indexPrefMatrix);
  //     const leavingFlows = this.calculateLeavingFlow(totalIndexPrefMatrix);
  //     const enteringFlows = this.calculateEnteringFlow(totalIndexPrefMatrix);
  //     const netFlows = this.calculateNetFlow(leavingFlows, enteringFlows);

  //     // console.log('totalIndexPrefMatrix');
  //     // console.log(totalIndexPrefMatrix);
  //     // console.log('leavingFlows');
  //     // console.log(leavingFlows);
  //     // console.log('enteringFlows');
  //     // console.log(enteringFlows);
  //     // console.log('netFlows');
  //     // console.log(netFlows);

  //     const ranking = siswaList
  //       .map((siswa, i) => ({
  //         nisn: siswa.nisn,
  //         total_nilai: netFlows[i],
  //       }))
  //       .sort((a, b) => b.total_nilai - a.total_nilai);

  //     await this.clearPreviousCalculations(this.prisma);

  //     const results = ranking.map((rank, i) => ({
  //       nisn: rank.nisn,
  //       total_nilai: rank.total_nilai,
  //       peringkat: i + 1,
  //       keterangan: rank.total_nilai >= 0 ? 'Diterima' : 'Ditolak',
  //     }));

  //     await this.saveCalculationResults(this.prisma, results);

  //     return res.status(HttpStatus.OK).json({
  //       status: 200,
  //       message: 'Perhitungan dan perankingan sukses',
  //       data: {},
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
  //       status: 500,
  //       message: 'Internal Server Error',
  //     });
  //   }
  // }

  // @ApiBearerAuth([ERole.ADM, ERole.KPS])
  // @Get()
  // async findAll(@Res() res: Response) {
  //   try {
  //     const hasil = await this.prisma.hasil_perhitungan.findMany({
  //       select: {
  //         data_siswa: {
  //           select: {
  //             nisn: true,
  //             nama_siswa: true,
  //             penghasilan_orang_tua: true,
  //             tanggungan_orang_tua: true,
  //             kelas: true,
  //             status: true,
  //           },
  //         },
  //         total_nilai: true,
  //         peringkat: true,
  //         keterangan: true,
  //         validasi: true,
  //       },
  //     });

  //     const result = hasil.map((data) => ({
  //       nisn: data.data_siswa.nisn,
  //       nama_siswa: data.data_siswa.nama_siswa,
  //       penghasilan_orang_tua: data.data_siswa.penghasilan_orang_tua,
  //       tanggungan_orang_tua: data.data_siswa.tanggungan_orang_tua,
  //       kelas: data.data_siswa.kelas,
  //       status: data.data_siswa.status,
  //       total_nilai: data.total_nilai,
  //       peringkat: data.peringkat,
  //       keterangan: data.keterangan,
  //       validasi:
  //         data.validasi === true ? 'Telah Divalidasi' : 'Belum Divalidasi',
  //     }));

  //     return res.status(HttpStatus.OK).json({
  //       status: 200,
  //       message: 'Data Hasil Berhasil Diambil',
  //       data: result,
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
  //       status: 500,
  //       message: 'Internal Server Error',
  //     });
  //   }
  // }

  // @ApiBearerAuth([ERole.KPS])
  // @Patch('validasi')
  // async validasi(@Res() res: Response) {
  //   try {
  //     const perhitungan = await this.prisma.hasil_perhitungan.updateMany({
  //       data: {
  //         validasi: true,
  //       },
  //     });

  //     return res.status(HttpStatus.OK).json({
  //       status: 200,
  //       message: 'Data Di Validasi',
  //       data: {},
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
  //       status: 500,
  //       message: 'Internal Server Error',
  //     });
  //   }
  // }

  // @ApiBearerAuth([ERole.SSW])
  // @Get('/laporan-hasil')
  // async findSiswa(@User() user: UserPayload, @Res() res: Response) {
  //   try {
  //     const hasil = await this.prisma.hasil_perhitungan.findMany({
  //       where: {
  //         validasi: true,
  //       },
  //       select: {
  //         data_siswa: {
  //           select: {
  //             nisn: true,
  //             nama_siswa: true,
  //             penghasilan_orang_tua: true,
  //             tanggungan_orang_tua: true,
  //             kelas: true,
  //             status: true,
  //           },
  //         },
  //         total_nilai: true,
  //         peringkat: true,
  //         keterangan: true,
  //         validasi: true,
  //       },
  //     });

  //     const result = hasil.map((data) => ({
  //       nisn: data.data_siswa.nisn,
  //       nama_siswa: data.data_siswa.nama_siswa,
  //       penghasilan_orang_tua: data.data_siswa.penghasilan_orang_tua,
  //       tanggungan_orang_tua: data.data_siswa.tanggungan_orang_tua,
  //       kelas: data.data_siswa.kelas,
  //       status: data.data_siswa.status,
  //       total_nilai: data.total_nilai,
  //       peringkat: data.peringkat,
  //       keterangan: data.keterangan,
  //       validasi:
  //         data.validasi === true ? 'Telah Divalidasi' : 'Belum Divalidasi',
  //     }));

  //     if (hasil.length === 0) {
  //       return res.status(HttpStatus.OK).json({
  //         status: 200,
  //         message: 'Belum Ada Data Divalidasi',
  //       });
  //     }

  //     return res.status(HttpStatus.OK).json({
  //       status: 200,
  //       message: 'Data Hasil Berhasil Diambil',
  //       data: result,
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
  //       status: 500,
  //       message: 'Internal Server Error',
  //     });
  //   }
  // }
}
