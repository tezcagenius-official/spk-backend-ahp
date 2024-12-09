import { Controller, Get, HttpStatus, Post, Query, Res } from '@nestjs/common';
import { PenilaianService } from './penilaian.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { filterPenilaianDto } from './filter_penilaian.dto';

@ApiTags('Penilaian')
@Controller('/api/penilaian')
export class PenilaianController {
  constructor(
    private readonly penilaianService: PenilaianService,
    private readonly prisma: PrismaService,
  ) {}

  // @Get()
  // async penilaian(@Res() res: Response) {
  //   try {
  //     // let { nisn, nama_siswa, page, perPage } = filter;

  //     // // default page & perPage
  //     // page = page ? Math.max(1, page) : 1;
  //     // perPage = perPage ? Math.max(1, perPage) : 10;

  //     // // jika perPage > 100 maka perPage = 100
  //     // perPage = perPage > 100 ? 100 : perPage;

  //     // const lastPage = Math.ceil(totalCount / perPage);

  //     // const skip = page > 0 ? perPage * (page - 1) : 0;

  //     const penilaian = await this.prisma.data_penilaian.findMany({
  //       select: {
  //         id_penilaian: true,
  //         bobot: true,
  //         kategori_bobot: true,
  //         data_kriteria: {
  //           select: {
  //             nama_kriteria: true,
  //           },
  //         },
  //         data_siswa: {
  //           select: {
  //             nisn: true,
  //             nama_siswa: true,
  //             penghasilan_orang_tua: true,
  //             tanggungan_orang_tua: true,
  //             kelas: true,
  //           },
  //         },
  //       },
  //       orderBy: {
  //         kategori_bobot: 'asc',
  //       },
  //     });

  //     const result = penilaian.map((res) => ({
  //       id: res.id_penilaian,
  //       nisn: res.data_siswa.nisn,
  //       nama_siswa: res.data_siswa.nama_siswa,
  //       penghasilan_orang_tua: res.data_siswa.penghasilan_orang_tua,
  //       tanggungan_orang_tua: res.data_siswa.tanggungan_orang_tua,
  //       kelas: res.data_siswa.kelas,
  //       bobot: res.bobot,
  //       kategori_bobot: res.kategori_bobot,
  //     }));

  //     return res.status(HttpStatus.OK).json({
  //       status: 200,
  //       message: 'Data Penilaian Berhasil Diambil',
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
