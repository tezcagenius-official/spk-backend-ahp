import { Controller, Get, Res } from '@nestjs/common';
import { ReportService } from './report.service';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ApiBearerAuth } from 'src/common/decorator/bearer_auth';
import { ERole } from 'src/common/enum/ERole';

@ApiTags('Report')
@Controller('/api/report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @ApiBearerAuth([ERole.ADM, ERole.ADM])
  @Get('excel')
  async excel(@Res() res: Response) {
    try {
      return this.reportService.exportToExcel(res);
    } catch (error) {
      console.log(error);
    }
  }
}
