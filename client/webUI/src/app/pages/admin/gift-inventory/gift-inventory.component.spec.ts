import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftInventoryComponent } from './gift-inventory.component';

describe('GiftInventoryComponent', () => {
  let component: GiftInventoryComponent;
  let fixture: ComponentFixture<GiftInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GiftInventoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GiftInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
