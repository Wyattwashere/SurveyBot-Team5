import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StopwordManagerComponent } from './stopword-manager.component';

describe('StopwordManagerComponent', () => {
  let component: StopwordManagerComponent;
  let fixture: ComponentFixture<StopwordManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StopwordManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StopwordManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
