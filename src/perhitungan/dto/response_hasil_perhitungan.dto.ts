import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { paginationDekoratorDto } from 'src/common/interface/paginationDekorator';

class NilaiDto {
  @ApiProperty({
    description: 'Nama Kriteria',
    example: 'Pengalaman',
  })
  kriteria: string;

  @ApiProperty({
    description: 'Nama Sub Kriteria',
    example: 'Sangat Baik',
  })
  sub_kriteria: string;

  @ApiProperty({
    description: 'Nilai dari kriteria dan sub kriteria',
    example: '0.1602',
  })
  nilai: string;
}

export class HasilPerhitunganResponseDto {
  @ApiProperty({
    description: 'Nama dari alternatif',
    example: 'Rian',
  })
  nama: string;

  @ApiProperty({
    description: 'Email dari alternatif',
    example: 'rian@gmail.com',
  })
  email: string;

  @ApiProperty({
    description: 'Nomor telepon dari alternatif',
    example: '087654545676',
  })
  nomor_telpon: string;

  @ApiProperty({
    description: 'Nama Divisi',
    example: 'Supervisor',
  })
  nama_divisi: string;

  @ApiProperty({
    description: 'Nilai yang didapatkan berdasarkan kriteria dan sub kriteria',
    type: [NilaiDto],
  })
  nilai: NilaiDto[];

  @ApiProperty({
    description: 'Total skor yang dihitung berdasarkan penilaian',
    example: '0.2817',
  })
  total_skor: string;

  @ApiProperty({
    description: 'Ranking dari alternatif',
    example: 1,
  })
  ranking: number;
}

export class RankingFilterDto extends paginationDekoratorDto {
  @ApiProperty({
    type: Number,
    description: 'divisi_id',
  })
  @Type(() => Number)
  @IsInt()
  divisi_id?: number;
}
