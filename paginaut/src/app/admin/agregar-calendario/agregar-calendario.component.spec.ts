import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarCalendarioComponent } from './agregar-calendario.component';

describe('AgregarCalendarioComponent', () => {
  let component: AgregarCalendarioComponent;
  let fixture: ComponentFixture<AgregarCalendarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgregarCalendarioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgregarCalendarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
