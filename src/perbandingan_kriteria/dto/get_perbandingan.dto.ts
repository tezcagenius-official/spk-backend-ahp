import {
  IsArray,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class PerbandingankriteriaResultDto {
  @ApiProperty({ example: 1 })
  kriteria1_id: number;

  @ApiProperty({ example: 2 })
  kriteria2_id: number;

  @ApiProperty({ example: 3 })
  nilai_perbandingan: number;
}

export class PerbandinganKriteriaDto {
  @ApiProperty({ example: 1 })
  divisi_id: number;

  @ApiProperty({ type: [PerbandingankriteriaResultDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PerbandingankriteriaResultDto)
  perbandingan: PerbandingankriteriaResultDto[];
}
