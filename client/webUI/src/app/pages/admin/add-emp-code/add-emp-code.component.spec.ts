import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmpCodeComponent } from './add-emp-code.component';

describe('AddEmpCodeComponent', () => {
  let component: AddEmpCodeComponent;
  let fixture: ComponentFixture<AddEmpCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEmpCodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEmpCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
