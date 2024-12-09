import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class PerbandinganDto {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  kriteria1_id: number;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ example: 2 })
  kriteria2_id: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 3 })
  nilai_perbandingan: number;
}

export class CreatePerbandinganDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PerbandinganDto)
  @ApiProperty({
    type: [PerbandinganDto],
    example: [
      {
        kriteria1_id: 1,
        kriteria2_id: 2,
        nilai_perbandingan: 3,
      },
    ],
  })
  perbandingan: PerbandinganDto[];
}
