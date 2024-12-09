import { Test, TestingModule } from '@nestjs/testing';
import { PerbandinganKriteriaService } from './perbandingan_kriteria.service';

describe('PerbandinganKriteriaService', () => {
  let service: PerbandinganKriteriaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PerbandinganKriteriaService],
    }).compile();

    service = module.get<PerbandinganKriteriaService>(PerbandinganKriteriaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
