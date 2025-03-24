import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { paginationDekoratorDto } from 'src/common/interface/paginationDekorator';

export class getResponseSubCriteriaDto {
  @ApiProperty({ example: 1 })
  sub_kriteria_id: number;

  @ApiProperty({ example: 1 })
  kriteria_id: number;

  @ApiProperty({ example: 'Sangat Bail' })
  nama_sub_kriteria: string;
}

export class SubKriteriaFilterDto extends paginationDekoratorDto {
  @ApiProperty({
    required: false,
    type: Number,
    description: 'kriteria_id',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  kriteria_id?: number;
}
