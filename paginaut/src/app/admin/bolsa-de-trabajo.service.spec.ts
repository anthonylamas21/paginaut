import { TestBed } from '@angular/core/testing';

import { BolsaDeTrabajoService } from './bolsa-de-trabajo.service';

describe('BolsaDeTrabajoService', () => {
  let service: BolsaDeTrabajoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BolsaDeTrabajoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
