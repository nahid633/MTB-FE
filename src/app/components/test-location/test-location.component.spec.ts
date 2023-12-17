import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestLocationComponent } from './test-location.component';

describe('TestLocationComponent', () => {
  let component: TestLocationComponent;
  let fixture: ComponentFixture<TestLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestLocationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
