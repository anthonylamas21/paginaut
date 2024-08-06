import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaAdminComponent } from './agenda-admin.component';

describe('AgendaAdminComponent', () => {
  let component: AgendaAdminComponent;
  let fixture: ComponentFixture<AgendaAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgendaAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgendaAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
