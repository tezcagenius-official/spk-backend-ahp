import { ApiProperty } from '@nestjs/swagger';

export class CalculateSubKriteriaAHPResponseDto {
  @ApiProperty({
    description: 'Matriks perbandingan sub-kriteria untuk kriteria tertentu',
    example: [
      [1, 3, 5],
      [0.3333, 1, 2],
      [0.2, 0.5, 1],
    ],
  })
  matriks: number[][];

  @ApiProperty({
    description: 'Matriks normalisasi sub-kriteria',
    example: [
      [0.5357, 0.6207, 0.5882],
      [0.1786, 0.2069, 0.2353],
      [0.1071, 0.1034, 0.1176],
    ],
  })
  matriksNormalisasi: number[][];

  @ApiProperty({
    description: 'Prioritas sub-kriteria berdasarkan kriteria tertentu',
    example: [0.5195, 0.2385, 0.1376],
  })
  prioritas: number[];

  @ApiProperty({
    description: 'Nilai eigen maksimum untuk sub-kriteria',
    example: 4.231625294,
  })
  eigenMax: number;

  @ApiProperty({
    description: 'Consistency Index (CI) untuk sub-kriteria',
    example: 0.077208431,
  })
  CI: number;

  @ApiProperty({
    description: 'Random Index (RI) untuk sub-kriteria',
    example: 0.9,
  })
  RI: number;

  @ApiProperty({
    description: 'Consistency Ratio (CR) untuk sub-kriteria',
    example: 0.085787146,
  })
  CR: number;

  @ApiProperty({
    description: 'Apakah matriks sub-kriteria konsisten',
    example: true,
  })
  konsisten: boolean;
}
