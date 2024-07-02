import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoBolsaComponent } from './info-bolsa.component';

describe('InfoBolsaComponent', () => {
  let component: InfoBolsaComponent;
  let fixture: ComponentFixture<InfoBolsaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InfoBolsaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InfoBolsaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
