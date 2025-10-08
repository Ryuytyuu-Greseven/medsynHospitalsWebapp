import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocsDashboardComponent } from './docs-dashboard.component';

describe('DocsDashboardComponent', () => {
  let component: DocsDashboardComponent;
  let fixture: ComponentFixture<DocsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocsDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
