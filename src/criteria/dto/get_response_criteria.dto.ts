import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { paginationDekoratorDto } from 'src/common/interface/paginationDekorator';

export class getResponseCriteriaDto {
  @ApiProperty({ example: 1 })
  kriteria_id: number;

  @ApiProperty({ example: 'Pengalaman' })
  nama_kriteria: string;

  @ApiProperty({ example: 0.222 })
  prioritas: number;

  @ApiProperty({ example: 1 })
  divisii_id: number;

  @ApiProperty({ example: 0.222 })
  nama_divisi: number;
}

export class KriteriaFilterDto extends paginationDekoratorDto {
  @ApiProperty({
    required: false,
    type: Number,
    description: 'divisi_id',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  divisi_id?: number;
}
