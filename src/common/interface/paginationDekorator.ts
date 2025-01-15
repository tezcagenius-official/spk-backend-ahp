import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';

export class paginationDekoratorDto {
  @IsNumberString()
  @IsOptional()
  @ApiProperty({ description: 'Page', required: false })
  page: number;

  @IsNumberString()
  @IsOptional()
  @ApiProperty({ description: 'Per Page', required: false })
  perPage: number;
}
