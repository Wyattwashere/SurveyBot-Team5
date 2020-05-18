import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyImportComponent } from './survey-import.component';

describe('SurveyImportComponent', () => {
  let component: SurveyImportComponent;
  let fixture: ComponentFixture<SurveyImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
