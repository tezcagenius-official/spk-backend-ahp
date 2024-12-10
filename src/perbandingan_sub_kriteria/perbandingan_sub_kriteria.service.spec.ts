import { Test, TestingModule } from '@nestjs/testing';
import { PerbandinganSubKriteriaService } from './perbandingan_sub_kriteria.service';

describe('PerbandinganSubKriteriaService', () => {
  let service: PerbandinganSubKriteriaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PerbandinganSubKriteriaService],
    }).compile();

    service = module.get<PerbandinganSubKriteriaService>(PerbandinganSubKriteriaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
