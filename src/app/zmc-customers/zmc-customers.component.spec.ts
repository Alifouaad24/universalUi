import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZmcCustomersComponent } from './zmc-customers.component';

describe('ZmcCustomersComponent', () => {
  let component: ZmcCustomersComponent;
  let fixture: ComponentFixture<ZmcCustomersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZmcCustomersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZmcCustomersComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
