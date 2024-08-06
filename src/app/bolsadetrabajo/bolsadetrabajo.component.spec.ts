import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BolsadetrabajoComponent } from './bolsadetrabajo.component';

describe('BolsadetrabajoComponent', () => {
  let component: BolsadetrabajoComponent;
  let fixture: ComponentFixture<BolsadetrabajoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BolsadetrabajoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BolsadetrabajoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
