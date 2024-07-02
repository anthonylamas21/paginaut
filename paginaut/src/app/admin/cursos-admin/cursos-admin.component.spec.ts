import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursosAdminComponent } from './cursos-admin.component';

describe('CursosAdminComponent', () => {
  let component: CursosAdminComponent;
  let fixture: ComponentFixture<CursosAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CursosAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CursosAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
