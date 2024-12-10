import { IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class PenilaianDto {
  @IsNumber()
  kriteriaId: number;

  @IsNumber()
  subKriteriaId: number;
}

export class CreatePenilaianAlternatifDto {
  @IsNumber()
  alternatifId: number;

  @IsArray()
  @ValidateNested({ each: true }) // Validasi setiap elemen dalam array
  @Type(() => PenilaianDto) // Konversi elemen ke `PenilaianDto`
  penilaian: PenilaianDto[];
}
