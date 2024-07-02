import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivacionFisicaComponent } from './activacion-fisica.component';

describe('ActivacionFisicaComponent', () => {
  let component: ActivacionFisicaComponent;
  let fixture: ComponentFixture<ActivacionFisicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActivacionFisicaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActivacionFisicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
