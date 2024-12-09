import { ApiProperty } from '@nestjs/swagger';

export class getResponseSubCriteriaDto {
  @ApiProperty({ example: 1 })
  sub_kriteria_id: number;

  @ApiProperty({ example: 1 })
  kriteria_id: number;

  @ApiProperty({ example: 'Sangat Bail' })
  nama_sub_kriteria: string;
}
