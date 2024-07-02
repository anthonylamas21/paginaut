import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DireccionesAdminComponent } from './direcciones-admin.component';

describe('DireccionesAdminComponent', () => {
  let component: DireccionesAdminComponent;
  let fixture: ComponentFixture<DireccionesAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DireccionesAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DireccionesAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
