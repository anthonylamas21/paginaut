import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarEventoComponent } from './registrar-evento.component';

describe('RegistrarEventoComponent', () => {
  let component: RegistrarEventoComponent;
  let fixture: ComponentFixture<RegistrarEventoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistrarEventoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistrarEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
