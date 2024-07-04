import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoEnfermeriaComponent } from './info-enfermeria.component';

describe('InfoEnfermeriaComponent', () => {
  let component: InfoEnfermeriaComponent;
  let fixture: ComponentFixture<InfoEnfermeriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InfoEnfermeriaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InfoEnfermeriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
