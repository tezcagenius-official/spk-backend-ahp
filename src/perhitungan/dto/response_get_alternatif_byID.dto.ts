import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class SubKriteriaDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  sub_kriteria_id: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  kriteria_id: number;

  @ApiProperty({ example: 'Baik' })
  @IsString()
  nama_sub_kriteria: string;

  @ApiProperty({ example: 123 })
  @IsNumber()
  prioritas: number;
}

class KriteriaDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  kriteria_id: number;

  @ApiProperty({ example: 'Pengalaman' })
  @IsString()
  nama_kriteria: string;

  @ApiProperty({ example: 123 })
  @IsNumber()
  prioritas: number;

  @ApiProperty({
    type: [SubKriteriaDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubKriteriaDto)
  sub_kriteria: SubKriteriaDto[];
}

class AlternatifDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  alternatif_id: number;

  @ApiProperty({ example: 'Udin' })
  @IsString()
  nama: string;

  @ApiProperty({ example: 'udin@gmail.com' })
  @IsString()
  email: string;

  @ApiProperty({ example: '083567654526' })
  @IsString()
  nomor_telpon: string;
}

export class GetAlternatifByIdResponseDto {
  @ApiProperty({
    type: AlternatifDto,
    description: 'Data Alternatif yang diminta',
  })
  @ValidateNested()
  @Type(() => AlternatifDto)
  alternatif: AlternatifDto;

  @ApiProperty({
    type: [KriteriaDto],
    description:
      'Daftar Kriteria dan Sub Kriteria terkait dengan Alternatif ini',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => KriteriaDto)
  kriteria: KriteriaDto[];
}
