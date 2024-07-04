import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarreraContaduriaComponent } from './carrera-contaduria.component';

describe('CarreraContaduriaComponent', () => {
  let component: CarreraContaduriaComponent;
  let fixture: ComponentFixture<CarreraContaduriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CarreraContaduriaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CarreraContaduriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
