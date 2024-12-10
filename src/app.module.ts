import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CriteriaModule } from './criteria/criteria.module';
import { PenilaianModule } from './penilaian/penilaian.module';
import { PerhitunganModule } from './perhitungan/perhitungan.module';
import { SubKriteriaModule } from './sub_kriteria/sub_kriteria.module';
import { PerbandinganKriteriaModule } from './perbandingan_kriteria/perbandingan_kriteria.module';
import { PerbandinganSubKriteriaModule } from './perbandingan_sub_kriteria/perbandingan_sub_kriteria.module';
import { AlternatifModule } from './alternatif/alternatif.module';

@Module({
  imports: [AuthModule, CriteriaModule, PenilaianModule, PerhitunganModule, SubKriteriaModule, PerbandinganKriteriaModule, PerbandinganSubKriteriaModule, AlternatifModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
