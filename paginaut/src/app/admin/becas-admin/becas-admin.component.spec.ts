import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BecasAdminComponent } from './becas-admin.component';

describe('BecasAdminComponent', () => {
  let component: BecasAdminComponent;
  let fixture: ComponentFixture<BecasAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BecasAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BecasAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
