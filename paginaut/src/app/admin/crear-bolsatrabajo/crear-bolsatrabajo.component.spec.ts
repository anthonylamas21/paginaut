import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearBolsatrabajoComponent } from './crear-bolsatrabajo.component';

describe('CrearBolsatrabajoComponent', () => {
  let component: CrearBolsatrabajoComponent;
  let fixture: ComponentFixture<CrearBolsatrabajoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrearBolsatrabajoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrearBolsatrabajoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
