import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefCatTaxComponent } from './ref-cat-tax.component';

describe('RefCatTaxComponent', () => {
  let component: RefCatTaxComponent;
  let fixture: ComponentFixture<RefCatTaxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RefCatTaxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RefCatTaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
