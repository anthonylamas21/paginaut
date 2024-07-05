import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarioAdminComponent } from './calendario-admin.component';

describe('CalendarioAdminComponent', () => {
  let component: CalendarioAdminComponent;
  let fixture: ComponentFixture<CalendarioAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CalendarioAdminComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarioAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
