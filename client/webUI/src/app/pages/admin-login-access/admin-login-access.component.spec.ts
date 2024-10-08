import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLoginAccessComponent } from './admin-login-access.component';

describe('AdminLoginAccessComponent', () => {
  let component: AdminLoginAccessComponent;
  let fixture: ComponentFixture<AdminLoginAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLoginAccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminLoginAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
