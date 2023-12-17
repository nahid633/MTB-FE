import { Component } from '@angular/core';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {NavComponent} from "../../components/nav/nav.component";
import {TestLocationComponent} from "../../components/test-location/test-location.component";

@Component({
  selector: 'app-play-simulation',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    NavComponent,
    TestLocationComponent
  ],
  templateUrl: './play-simulation.component.html',
  styleUrl: './play-simulation.component.scss'
})
export class PlaySimulationComponent {
}
