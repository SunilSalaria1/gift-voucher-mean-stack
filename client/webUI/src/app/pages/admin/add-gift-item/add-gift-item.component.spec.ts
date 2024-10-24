import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGiftItemComponent } from './add-gift-item.component';

describe('AddGiftItemComponent', () => {
  let component: AddGiftItemComponent;
  let fixture: ComponentFixture<AddGiftItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddGiftItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddGiftItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
