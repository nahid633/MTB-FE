import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Booking} from "../models/booking.model";
import {delay, filter, map, Observable, of, switchMap} from "rxjs";
import {TestTypeOptions} from "../pages/booking/constants";
import {ProcessTypesEnum} from "../models/test-types.enum";

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private httpClient = inject(HttpClient)
  private readonly apiUrl = 'http://localhost:3001/api/';

  getBookings(): Observable<string[]> {
    return this.httpClient.get<Booking[]>(`${this.apiUrl}booking`).pipe(
      map(f =>
        f.filter(test => test.testDetails.testType === ProcessTypesEnum.IN_PLACE || test.testDetails.testType === ProcessTypesEnum.IN_PLACE_AR)
          .map(b =>b.testDetails.preferredDate )))
  }

  removeBookingById(id: string): Observable<Booking> {
    return this.httpClient.delete<Booking>(`${this.apiUrl}booking/${id}`);
  }

  getBookingById(id: string): Observable<Booking> {
    return this.httpClient.get<Booking>(`${this.apiUrl}booking/${id}`);
  }

  createBooking(payload: Booking): Observable<string> {
    return of(null)
      .pipe(
        delay(3000),
        switchMap(() =>
        this.httpClient.post<string>(`${this.apiUrl}booking`, payload))
      );
  }

  updateBookingById(id: string, payload: Booking): Observable<Booking> {
    return this.httpClient.put<Booking>(`${this.apiUrl}booking/${id}`, payload);
  }
}
