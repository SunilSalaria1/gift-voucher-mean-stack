import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectGiftVoucherComponent } from './select-gift-voucher.component';

describe('SelectGiftVoucherComponent', () => {
  let component: SelectGiftVoucherComponent;
  let fixture: ComponentFixture<SelectGiftVoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectGiftVoucherComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectGiftVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
