import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyExportComponent } from './survey-export.component';

describe('SurveyExportComponent', () => {
  let component: SurveyExportComponent;
  let fixture: ComponentFixture<SurveyExportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyExportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
