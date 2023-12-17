import {inject, Injectable} from '@angular/core';
import {delay, Observable, Observer, of, switchMap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Booking} from "../models/booking.model";

@Injectable({
  providedIn: 'root'
})
export class CertificationService {
  private httpClient = inject(HttpClient)
  private readonly apiUrl = 'http://localhost:3001/api/';
  constructor() { }

  uploadFile(selectedFile: File): Observable<string> {
    return new Observable((observer: Observer<string>) => {
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        const xhr: XMLHttpRequest = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              observer.next(xhr.responseText);
              observer.complete();
            } else {
              observer.error(xhr.responseText);
            }
          }
        };

        xhr.open('POST', `${this.apiUrl}certification/upload-file`, true);
        xhr.send(formData);
      } else {
        observer.error('No file selected.');
      }
    });
  }
  createCertification(payload: any): Observable<string> {
    return of(null)
      .pipe(
        delay(3000),
        switchMap(() =>
          this.httpClient.post<string>(`${this.apiUrl}certification`, payload))
      );
  }
}
