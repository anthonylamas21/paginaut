import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrerasAdminComponent } from './carreras-admin.component';

describe('CarrerasAdminComponent', () => {
  let component: CarrerasAdminComponent;
  let fixture: ComponentFixture<CarrerasAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CarrerasAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CarrerasAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
