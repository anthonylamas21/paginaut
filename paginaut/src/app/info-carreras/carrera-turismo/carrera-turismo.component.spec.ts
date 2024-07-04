import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarreraTurismoComponent } from './carrera-turismo.component';

describe('CarreraTurismoComponent', () => {
  let component: CarreraTurismoComponent;
  let fixture: ComponentFixture<CarreraTurismoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CarreraTurismoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CarreraTurismoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
