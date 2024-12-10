import { Test, TestingModule } from '@nestjs/testing';
import { AlternatifService } from './alternatif.service';

describe('AlternatifService', () => {
  let service: AlternatifService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlternatifService],
    }).compile();

    service = module.get<AlternatifService>(AlternatifService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
