import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {MatProgressBarModule} from "@angular/material/progress-bar";

@Component({
  selector: 'app-step',
  standalone: true,
  imports: [
    MatCardModule,
    MatProgressBarModule
  ],
  templateUrl: './step.component.html',
  styleUrl: './step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepComponent {
  @Input() showProgressBar: boolean = false;
  @Input() title: string = ''
  @Input() description: string = ''
}
