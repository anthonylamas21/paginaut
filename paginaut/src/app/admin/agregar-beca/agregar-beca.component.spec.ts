import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarBecaComponent } from './agregar-beca.component';

describe('AgregarBecaComponent', () => {
  let component: AgregarBecaComponent;
  let fixture: ComponentFixture<AgregarBecaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgregarBecaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgregarBecaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
