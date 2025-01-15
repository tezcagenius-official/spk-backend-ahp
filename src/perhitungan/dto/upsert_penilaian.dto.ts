import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class PenilaianDto {
  @ApiProperty({ description: 'ID Kriteria', example: 1 })
  @IsInt()
  @IsNotEmpty()
  kriteria_id: number;

  @ApiProperty({ description: 'ID Sub Kriteria', example: 2 })
  @IsInt()
  @IsNotEmpty()
  sub_kriteria_id: number;
}

export class UpsertPenilaianAlternatifDto {
  @ApiProperty({ description: 'ID Alternatif', example: 1 })
  @IsInt()
  @IsNotEmpty()
  alternatif_id: number;

  @ApiProperty({
    description: 'Array dari penilaian kriteria dan sub-kriteria',
    type: [PenilaianDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PenilaianDto)
  penilaian: PenilaianDto[];
}
