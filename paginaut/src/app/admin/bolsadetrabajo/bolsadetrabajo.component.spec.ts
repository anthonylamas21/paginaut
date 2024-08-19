import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarBolsaTrabajoComponent } from './bolsadetrabajo.component';

describe('AgregarBolsaTrabajoComponent', () => {
  let component: AgregarBolsaTrabajoComponent;
  let fixture: ComponentFixture<AgregarBolsaTrabajoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgregarBolsaTrabajoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AgregarBolsaTrabajoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
