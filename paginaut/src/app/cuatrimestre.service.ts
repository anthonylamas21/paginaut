import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CuatrimestreService {
  private apiUrl = 'http://localhost/paginaut/api/cuatrimestres';

  constructor(private http: HttpClient) {}

  // Obtener todos los cuatrimestres
  getCuatrimestres(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  // Obtener cuatrimestres por carrera
  getCuatrimestresByCarrera(carreraId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/carrera/${carreraId}`);
  }

  // Asignar asignaturas a un cuatrimestre
  asignarAsignaturas(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/asignar-asignaturas`, data);
  }
}
