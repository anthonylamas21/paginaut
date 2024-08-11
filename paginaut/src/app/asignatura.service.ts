import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AsignaturaService {
  private apiUrl = 'http://tu-api.com/api/asignaturas';

  constructor(private http: HttpClient) {}

  getAsignaturas(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }
}
