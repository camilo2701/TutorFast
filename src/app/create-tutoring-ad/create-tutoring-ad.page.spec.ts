import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateTutoringAdPage } from './create-tutoring-ad.page';

describe('CreateTutoringAdPage', () => {
  let component: CreateTutoringAdPage;
  let fixture: ComponentFixture<CreateTutoringAdPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTutoringAdPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
