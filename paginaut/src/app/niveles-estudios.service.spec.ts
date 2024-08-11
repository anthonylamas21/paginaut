import { TestBed } from '@angular/core/testing';

import { NivelesEstudiosService } from './niveles-estudios.service';

describe('NivelesEstudiosService', () => {
  let service: NivelesEstudiosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NivelesEstudiosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
