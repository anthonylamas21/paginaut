import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TallerAdminComponent } from './taller-admin.component';

describe('TallerAdminComponent', () => {
  let component: TallerAdminComponent;
  let fixture: ComponentFixture<TallerAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TallerAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TallerAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
