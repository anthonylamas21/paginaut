import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarreraProcesosAlimentarioComponent } from './carrera-procesos-alimentario.component';

describe('CarreraProcesosAlimentarioComponent', () => {
  let component: CarreraProcesosAlimentarioComponent;
  let fixture: ComponentFixture<CarreraProcesosAlimentarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CarreraProcesosAlimentarioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CarreraProcesosAlimentarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
