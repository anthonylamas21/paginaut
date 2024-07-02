import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoUnidadesComponent } from './info-unidades.component';

describe('InfoUnidadesComponent', () => {
  let component: InfoUnidadesComponent;
  let fixture: ComponentFixture<InfoUnidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InfoUnidadesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InfoUnidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
