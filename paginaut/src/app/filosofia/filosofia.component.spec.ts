import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilosofiaComponent } from './filosofia.component';

describe('FilosofiaComponent', () => {
  let component: FilosofiaComponent;
  let fixture: ComponentFixture<FilosofiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilosofiaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FilosofiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
