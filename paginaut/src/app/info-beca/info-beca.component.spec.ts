import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoBecaComponent } from './info-beca.component';

describe('InfoBecaComponent', () => {
  let component: InfoBecaComponent;
  let fixture: ComponentFixture<InfoBecaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InfoBecaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InfoBecaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
