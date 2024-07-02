import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasquetbolComponent } from './basquetbol.component';

describe('BasquetbolComponent', () => {
  let component: BasquetbolComponent;
  let fixture: ComponentFixture<BasquetbolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BasquetbolComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BasquetbolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
