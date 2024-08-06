import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiedraEstanqueComponent } from './piedra-estanque.component';

describe('PiedraEstanqueComponent', () => {
  let component: PiedraEstanqueComponent;
  let fixture: ComponentFixture<PiedraEstanqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PiedraEstanqueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PiedraEstanqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
