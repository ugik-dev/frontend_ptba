import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRegionsComponent } from './manage-regions.component';

describe('ManageRegionsComponent', () => {
  let component: ManageRegionsComponent;
  let fixture: ComponentFixture<ManageRegionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageRegionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageRegionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
