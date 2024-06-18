import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnidadesAcademicasComponent } from './unidades-academicas.component';

describe('UnidadesAcademicasComponent', () => {
  let component: UnidadesAcademicasComponent;
  let fixture: ComponentFixture<UnidadesAcademicasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnidadesAcademicasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UnidadesAcademicasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
