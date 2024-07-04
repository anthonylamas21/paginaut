import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarreraDesarrolloSoftwareComponent } from './carrera-desarrollo-software.component';

describe('CarreraDesarrolloSoftwareComponent', () => {
  let component: CarreraDesarrolloSoftwareComponent;
  let fixture: ComponentFixture<CarreraDesarrolloSoftwareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CarreraDesarrolloSoftwareComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CarreraDesarrolloSoftwareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
