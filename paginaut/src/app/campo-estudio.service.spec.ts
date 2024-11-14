import { TestBed } from '@angular/core/testing';

import { CampoEstudioService } from './campo-estudio.service';

describe('CampoEstudioService', () => {
  let service: CampoEstudioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CampoEstudioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
