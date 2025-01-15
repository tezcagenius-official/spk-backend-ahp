import {
  IsArray,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class PerbandinganSubKriteriaResultDto {
  @ApiProperty({ example: 1 })
  sub_kriteria1_id: number;

  @ApiProperty({ example: 2 })
  sub_kriteria2_id: number;

  @ApiProperty({ example: 3 })
  nilai_perbandingan: number;
}

export class PerbandinganSubKriteriaDto {
  @ApiProperty({ example: 4 })
  kriteria_id: number;

  @ApiProperty({ type: [PerbandinganSubKriteriaResultDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PerbandinganSubKriteriaResultDto)
  perbandingan: PerbandinganSubKriteriaResultDto[];
}
