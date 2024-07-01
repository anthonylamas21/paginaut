import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarreraMercadotecniaComponent } from './carrera-mercadotecnia.component';

describe('CarreraMercadotecniaComponent', () => {
  let component: CarreraMercadotecniaComponent;
  let fixture: ComponentFixture<CarreraMercadotecniaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CarreraMercadotecniaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CarreraMercadotecniaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
