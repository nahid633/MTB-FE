import { Routes } from '@angular/router';

export const routes: Routes = [
  {path: 'test', loadComponent: () => import('./components/test-location/test-location.component').then(component => component.TestLocationComponent)},
  {path: '', loadComponent: () => import('./pages/landing/landing.component').then(component => component.LandingComponent)},
  {path: 'booking', loadComponent: () => import('./pages/booking/booking.component').then(component => component.BookingComponent)},
  {path: 'certification', loadComponent: () => import('./pages/certification/certification.component').then(component => component.CertificationComponent)},
  {path: 'play-simulation', loadComponent: () => import('./pages/play-simulation/play-simulation.component').then(component => component.PlaySimulationComponent)}
];
