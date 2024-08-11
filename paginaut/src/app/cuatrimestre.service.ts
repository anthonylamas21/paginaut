import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CuatrimestreService {
  private apiUrl = 'http://tu-api.com/api/cuatrimestres';

  constructor(private http: HttpClient) {}

  getCuatrimestres(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  asignarAsignaturas(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/asignar-asignaturas`, data);
  }
}
