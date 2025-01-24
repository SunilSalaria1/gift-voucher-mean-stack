import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateEmpCodeComponent } from './generate-emp-code.component';

describe('GenerateEmpCodeComponent', () => {
  let component: GenerateEmpCodeComponent;
  let fixture: ComponentFixture<GenerateEmpCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerateEmpCodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateEmpCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
