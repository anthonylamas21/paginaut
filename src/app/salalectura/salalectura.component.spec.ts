import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalalecturaComponent } from './salalectura.component';

describe('SalalecturaComponent', () => {
  let component: SalalecturaComponent;
  let fixture: ComponentFixture<SalalecturaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SalalecturaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SalalecturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
