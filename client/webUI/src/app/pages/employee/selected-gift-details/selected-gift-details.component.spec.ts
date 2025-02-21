import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedGiftDetailsComponent } from './selected-gift-details.component';

describe('SelectedGiftDetailsComponent', () => {
  let component: SelectedGiftDetailsComponent;
  let fixture: ComponentFixture<SelectedGiftDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectedGiftDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectedGiftDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
