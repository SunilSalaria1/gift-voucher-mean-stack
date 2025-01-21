import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeFooterComponent } from './employee-footer.component';

describe('EmployeeFooterComponent', () => {
  let component: EmployeeFooterComponent;
  let fixture: ComponentFixture<EmployeeFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeFooterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
