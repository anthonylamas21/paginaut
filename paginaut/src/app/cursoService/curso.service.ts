import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { API } from '../constans';
import { EncryptionService } from '../admin/encryption.service';

export interface Curso {
  id?: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
  fecha_creacion?: string;
  fecha_string?: string;
  imagen_principal?: string;
  imagenes_generales?: string[];
  profesor: string;
  [key: string]: any;
}

export interface CursoResponse {
  records: Curso[];
}

@Injectable({
  providedIn: 'root',
})
export class CursoService {
  private apiUrl = API+'/api/curso'; // Actualiza esta URL si es necesario
  private apiUrlProfe = API+'/api/profesor';
  private apiCursoProfe = API+'/api/curso_maestro';

  constructor(private http: HttpClient, private encryptionService: EncryptionService) {}

  // Otros métodos...

  crearCursoConProfesores(data: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, data).pipe(catchError(this.handleError));
  }

  eliminarProfesoresPorCurso(cursoId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiCursoProfe}/eliminar-profesores?curso_id=${cursoId}`)
        .pipe(catchError(this.handleError));
  }

  asignarProfesores(profesoresData: { curso_id: number; profesor_id: number }[]): Observable<any> {
      return this.http.post<any>(`${this.apiCursoProfe}/asignar-profesores`, profesoresData)
          .pipe(catchError(this.handleError));
  }


  obtenerCurso(): Observable<CursoResponse> {
    return this.http
      .get<CursoResponse>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  getCursos(): Observable<Curso[]> {
    return this.http
      .get<CursoResponse>(this.apiUrl)
      .pipe(
        map(response => response.records), // Mapea la respuesta para obtener solo los cursos
        catchError(this.handleError)
      );
  }

  obtenerCursoPorId(id: number): Observable<Curso> {
    return this.http
      .get<Curso>(`${this.apiUrl}?id=${id}`)
      .pipe(catchError(this.handleError));
  }

  obtenerProfesorPorId(profesorId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrlProfe}?profesor_id=${profesorId}`)
      .pipe(
        map(response => {
          if (response.data) {
            const decryptedData = this.encryptionService.decrypt(response.data);
            return decryptedData;
          } else {
            throw new Error('Formato de respuesta inválido');
          }
        }),
        catchError(this.handleError)
      );
  }

  
  obtenerProfesoresPorCurso(cursoId: number): Observable<any> {
    return this.http.get<any>(`${this.apiCursoProfe}/profesores-por-curso?curso_id=${cursoId}`);
  }

  actualizarCurso(data: any, id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}?id=${id}`, data).pipe(catchError(this.handleError));
  }  

  eliminarCurso(id: number): Observable<any> {
    return this.http
      .delete<any>(`${this.apiUrl}?id=${id}&accion=remover`)
      .pipe(catchError(this.handleError));
  }

  eliminarImagenGeneral(cursoId: number, rutaImagen: string): Observable<any> {
    return this.http.delete<any>(
      `${this.apiUrl}?cursoId=${cursoId}&rutaImagen=${encodeURIComponent(rutaImagen)}`
    ).pipe(catchError(this.handleError));
  }

  desactivarCurso(id: number): Observable<any> {
    return this.http
      .put(`${this.apiUrl}?id=${id}&accion=desactivar`, null)
      .pipe(catchError(this.handleError));
  }

  activarCurso(id: number): Observable<any> {
    return this.http
      .put(`${this.apiUrl}?id=${id}&accion=activar`, {})
      .pipe(catchError(this.handleError));
  }

  GetProfesores(): Observable<any> {
    return this.http.get<any>(this.apiUrlProfe)
      .pipe(
        map(response => {
          if (response.data) {
            const decryptedData = this.encryptionService.decrypt(response.data);
            return decryptedData;
          } else {
            throw new Error('Formato de respuesta inválido');
          }
        }),
        catchError(this.handleError)
      );
  }

  ObtenerProfesoresActivos(): Observable<any> {
    return this.http.get<any>(`${this.apiUrlProfe}?accion=getprofesores`)
      .pipe(
        map(response => {
          if (response.data) {
            const decryptedData = this.encryptionService.decrypt(response.data);
            return decryptedData;
          } else {
            throw new Error('Formato de respuesta inválido');
          }
        }),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    //console.error(errorMessage);
    return throwError(() => errorMessage);
  }
}
