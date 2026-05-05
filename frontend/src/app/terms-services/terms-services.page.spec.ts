import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TermsServicesPage } from './terms-services.page';

describe('TermsServicesPage', () => {
  let component: TermsServicesPage;
  let fixture: ComponentFixture<TermsServicesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsServicesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
