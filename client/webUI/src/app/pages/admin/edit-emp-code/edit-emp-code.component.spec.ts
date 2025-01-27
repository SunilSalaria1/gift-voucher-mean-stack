import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEmpCodeComponent } from './edit-emp-code.component';

describe('EditEmpCodeComponent', () => {
  let component: EditEmpCodeComponent;
  let fixture: ComponentFixture<EditEmpCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditEmpCodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditEmpCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
