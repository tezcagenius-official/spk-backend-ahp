import { Test, TestingModule } from '@nestjs/testing';
import { SubKriteriaService } from './sub_kriteria.service';

describe('SubKriteriaService', () => {
  let service: SubKriteriaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubKriteriaService],
    }).compile();

    service = module.get<SubKriteriaService>(SubKriteriaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
