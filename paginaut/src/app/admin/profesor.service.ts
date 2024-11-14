import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { API } from '../constans';
import { EncryptionService } from './encryption.service';

export interface Profesor {
  id?: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono?: string;
  especialidad?: string;
  grado_academico?: string;
  experiencia?: string;
  foto?: string;
  activo?: boolean;
  fecha_creacion?: string;
}

export interface TipoProfesor {
  id?: number;
  profesor_id: number;
  tipo_id: number;
}

export interface ProfesorResponse {
  records: Profesor[];
}

@Injectable({
  providedIn: 'root',
})
export class ProfesorService {
  private apiUrl = API+'/api/profesor';
  private tipoUrl = API+'/api/tipo-pro';

  constructor(private http: HttpClient, private encryptionService: EncryptionService) {}

  addProfesor(profesor: FormData): Observable<any> {
    return this.http
      .post<any>(this.apiUrl, profesor);
  }

  getProfesores(): Observable<any> {
    return this.http.get(this.apiUrl).pipe(
      map((response: any) => {
        console.log('Respuesta del servidor:', response);
        
        if ( response.data) {
          const decryptedData = this.encryptionService.decrypt(response.data);
          console.log('Datos desencriptados:', decryptedData);
          return decryptedData;
        } else {
          throw new Error('Formato de respuesta inválido');
        }
      }),
      catchError(error => {
        console.error('Error en el servicio:', error);
        throw error;
      })
    );
  }

  getProfesorById(id: number): Observable<Profesor> {
    return this.http
      .get<Profesor>(`${this.apiUrl}?id=${id}`);
  }

  updateProfesor(profesor: FormData): Observable<any> {
    return this.http
      .post<any>(this.apiUrl, profesor) // Usando POST para la actualización;
  }

  deleteProfesor(id: number): Observable<any> {
    return this.http
      .delete<any>(`${this.apiUrl}?id=${id}`);
  }

  // TIPOS DE PROFESORES
  getTiposProfesor(profesor_id: number): Observable<TipoProfesor[]> {
    return this.http
      .get<TipoProfesor[]>(`${this.tipoUrl}?profesor_id=${profesor_id}`);
  }

  addTipoProfesor(tiposProfesor: TipoProfesor[]): Observable<any> {
    return this.http
      .post<any>(this.tipoUrl, tiposProfesor);
  }

  deleteTiposByProfesorId(profesor_id: number): Observable<any> {
    return this.http
      .delete<any>(`${this.tipoUrl}?profesor_id=${profesor_id}`);
  }

}
