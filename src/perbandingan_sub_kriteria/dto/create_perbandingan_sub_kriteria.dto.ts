import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class SubKriteriaPerbandinganDto {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  sub_kriteria1_id: number;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  sub_kriteria2_id: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  nilai_perbandingan: number;
}

export class CreateSubKriteriaPerbandinganDto {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ description: 'ID kriteria induk' })
  kriteria_id: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubKriteriaPerbandinganDto)
  @ApiProperty({ type: [SubKriteriaPerbandinganDto] })
  perbandingan: SubKriteriaPerbandinganDto[];
}
