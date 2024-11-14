import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API } from './constans';

@Injectable({
  providedIn: 'root'
})
export class AsignaturaService {
  private apiUrl = API+'/api/asignaturas';

  constructor(private http: HttpClient) {}

  // Obtener todas las asignaturas
  getAsignaturas(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  // Guardar una nueva asignatura
  saveAsignatura(asignaturaData: any): Observable<any> {
    if (asignaturaData.id) {
      // Si hay un ID, se está editando la asignatura
      return this.http.put(`${this.apiUrl}/${asignaturaData.id}`, asignaturaData);
    } else {
      // Si no hay ID, se está creando una nueva asignatura
      return this.http.post(this.apiUrl, asignaturaData);
    }
  }

  deleteAsignatura(id: number): Observable<any> {
    const url = `${this.apiUrl}`;  // No incluir el ID en la URL
    const body = { id };  // Pasar el ID en el cuerpo de la solicitud
    //console.log('URL de eliminación:', url);  // Solo muestra la URL base
    //console.log('ID en el cuerpo de la solicitud:', body);  // Verificar que el cuerpo contiene el ID
    return this.http.request('DELETE', url, { body });  // Usar el método request para enviar el cuerpo
}





  // Obtener una asignatura por ID
  getAsignaturaById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Actualizar una asignatura
  updateAsignatura(id: number, data: any): Observable<any> {
    const url = `${this.apiUrl}`;  // No incluir el ID en la URL
    const body = { id, ...data };  // Incluir el ID junto con los datos en el cuerpo de la solicitud
    //console.log('URL de actualización:', url);  // Mostrar la URL base
    //console.log('Datos en el cuerpo de la solicitud:', body);  // Verificar que el cuerpo contiene el ID y los datos
    return this.http.request('PUT', url, { body });  // Usar el método request para enviar el cuerpo
  }



}
