import { TestBed } from '@angular/core/testing';

import { BolsaTrabajoService } from './bolsa-trabajo.service';

describe('BolsaTrabajoService', () => {
  let service: BolsaTrabajoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BolsaTrabajoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
