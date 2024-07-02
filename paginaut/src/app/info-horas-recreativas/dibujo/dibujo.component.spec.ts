import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DibujoComponent } from './dibujo.component';

describe('DibujoComponent', () => {
  let component: DibujoComponent;
  let fixture: ComponentFixture<DibujoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DibujoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DibujoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
