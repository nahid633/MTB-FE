import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaySimulationComponent } from './play-simulation.component';

describe('PlaySimulationComponent', () => {
  let component: PlaySimulationComponent;
  let fixture: ComponentFixture<PlaySimulationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaySimulationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlaySimulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
