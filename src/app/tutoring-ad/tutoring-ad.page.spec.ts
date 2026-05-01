import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TutoringAdPage } from './tutoring-ad.page';

describe('TutoringAdPage', () => {
  let component: TutoringAdPage;
  let fixture: ComponentFixture<TutoringAdPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TutoringAdPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
