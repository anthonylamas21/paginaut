import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarreraAdministracionComponent } from './carrera-administracion.component';

describe('CarreraAdministracionComponent', () => {
  let component: CarreraAdministracionComponent;
  let fixture: ComponentFixture<CarreraAdministracionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CarreraAdministracionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CarreraAdministracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
