import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Brackets } from 'src/app/model/bracket';

@Injectable({
  providedIn: 'root',
})
export class BracketsService {
  constructor(private http: HttpClient) {}

  url = environment.api.url + 'brackets';

  get(): Observable<Brackets> {
    return this.http.get<Brackets>(this.url);
  }

  getByYear(year: string): Observable<Brackets> {
    return this.http.get<Brackets>(this.url + '/' + year);
  }
}
