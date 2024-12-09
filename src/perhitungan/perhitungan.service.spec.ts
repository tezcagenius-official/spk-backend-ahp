import { Test, TestingModule } from '@nestjs/testing';
import { PerhitunganService } from './perhitungan.service';

describe('PerhitunganService', () => {
  let service: PerhitunganService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PerhitunganService],
    }).compile();

    service = module.get<PerhitunganService>(PerhitunganService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
