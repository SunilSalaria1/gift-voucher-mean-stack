import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGiftItemComponent } from './edit-gift-item.component';

describe('EditGiftItemComponent', () => {
  let component: EditGiftItemComponent;
  let fixture: ComponentFixture<EditGiftItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditGiftItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditGiftItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
