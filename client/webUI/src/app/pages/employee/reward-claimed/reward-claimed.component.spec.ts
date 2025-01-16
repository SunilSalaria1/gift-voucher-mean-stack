import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RewardClaimedComponent } from './reward-claimed.component';

describe('RewardClaimedComponent', () => {
  let component: RewardClaimedComponent;
  let fixture: ComponentFixture<RewardClaimedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RewardClaimedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RewardClaimedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
