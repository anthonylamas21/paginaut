/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { VistasService } from './vistas.service';

describe('Service: Vistas', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VistasService]
    });
  });

  it('should ...', inject([VistasService], (service: VistasService) => {
    expect(service).toBeTruthy();
  }));
});
