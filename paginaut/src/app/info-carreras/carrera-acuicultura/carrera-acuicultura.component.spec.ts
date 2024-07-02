import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarreraAcuiculturaComponent } from './carrera-acuicultura.component';

describe('CarreraAcuiculturaComponent', () => {
  let component: CarreraAcuiculturaComponent;
  let fixture: ComponentFixture<CarreraAcuiculturaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CarreraAcuiculturaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CarreraAcuiculturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
