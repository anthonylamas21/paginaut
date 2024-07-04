import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarreraAgrobiotecnologiaComponent } from './carrera-agrobiotecnologia.component';

describe('CarreraAgrobiotecnologiaComponent', () => {
  let component: CarreraAgrobiotecnologiaComponent;
  let fixture: ComponentFixture<CarreraAgrobiotecnologiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CarreraAgrobiotecnologiaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CarreraAgrobiotecnologiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
