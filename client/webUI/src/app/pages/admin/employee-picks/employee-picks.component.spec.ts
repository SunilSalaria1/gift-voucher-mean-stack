import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePicksComponent } from './employee-picks.component';

describe('EmployeePicksComponent', () => {
  let component: EmployeePicksComponent;
  let fixture: ComponentFixture<EmployeePicksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeePicksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeePicksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
