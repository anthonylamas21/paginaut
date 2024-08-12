import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AsignaturaService {
  private apiUrl = 'http://localhost/paginaut/api/asignaturas';

  constructor(private http: HttpClient) {}

  // Obtener todas las asignaturas
  getAsignaturas(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  // Guardar una nueva asignatura
  saveAsignatura(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, data);
  }

  // Obtener una asignatura por ID
  getAsignaturaById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Actualizar una asignatura
  updateAsignatura(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  // Eliminar una asignatura
  deleteAsignatura(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
