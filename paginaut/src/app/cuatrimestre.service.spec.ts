import { TestBed } from '@angular/core/testing';

import { CuatrimestreService } from './cuatrimestre.service';

describe('CuatrimestreService', () => {
  let service: CuatrimestreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CuatrimestreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
