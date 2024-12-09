import { ApiProperty } from '@nestjs/swagger';

export class getResponseCriteriaDto {
  @ApiProperty({ example: 1 })
  kriteria_id: number;

  @ApiProperty({ example: 'Pengalaman' })
  nama_kriteria: string;
}
