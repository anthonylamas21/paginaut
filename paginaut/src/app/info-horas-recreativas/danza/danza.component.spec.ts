import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DanzaComponent } from './danza.component';

describe('DanzaComponent', () => {
  let component: DanzaComponent;
  let fixture: ComponentFixture<DanzaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DanzaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DanzaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
