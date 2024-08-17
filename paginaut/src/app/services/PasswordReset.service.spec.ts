/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PasswordResetService } from './PasswordReset.service';

describe('Service: PasswordReset', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PasswordResetService]
    });
  });

  it('should ...', inject([PasswordResetService], (service: PasswordResetService) => {
    expect(service).toBeTruthy();
  }));
});
