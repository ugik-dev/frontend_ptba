import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefSubCatTaxComponent } from './ref-sub-cat-tax.component';

describe('RefSubCatTaxComponent', () => {
  let component: RefSubCatTaxComponent;
  let fixture: ComponentFixture<RefSubCatTaxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RefSubCatTaxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RefSubCatTaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
