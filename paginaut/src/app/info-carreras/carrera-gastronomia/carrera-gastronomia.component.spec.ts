import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarreraGastronomiaComponent } from './carrera-gastronomia.component';

describe('CarreraGastronomiaComponent', () => {
  let component: CarreraGastronomiaComponent;
  let fixture: ComponentFixture<CarreraGastronomiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CarreraGastronomiaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CarreraGastronomiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
