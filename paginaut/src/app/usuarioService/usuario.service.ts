import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

export interface Usuario {
  id?: number;
  correo: string;
  contrasena: string;
  rol_id: number;
  departamento_id: number;
  token_recuperacion: string;
  fecha_expiracion_token: string;
  activo?: boolean;
  fecha_creacion?: string;
}

export interface Rol {
  id?: number;
  nombre?: string;
  activo?: boolean;
  fecha_creacion?: string;
}

export interface Departamento{
  id?: number;
  nombre: string;
  activo?: boolean;
  fecha_creacion?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost/paginaut/api/usuario.php';

  private apiUrlRol = 'http://localhost/paginaut/api/rol.php';

  private apiUrlDep = 'http://localhost/paginaut/api/departamento.php';

  constructor(private clientService: HttpClient) { }

  agregarUsuario(usuario: Usuario): Observable<any> {
    return this.clientService.post<any>(this.apiUrl, usuario).pipe(
      catchError(this.handleError)
    );
  }

  obtenerUsuarios(): Observable<any> {
    return this.clientService.get<any>(this.apiUrl).pipe(
      catchError(this.handleError));
  }

  obtenerRoles(): Observable<any> {
    return this.clientService.get<any>(this.apiUrlRol).pipe(
      catchError(this.handleError));
  }

  obtenerRol(rol_id: number): Observable<Usuario> {
    return this.clientService
      .get<Usuario>(`${this.apiUrlRol}?id=${rol_id}`).pipe(
        catchError(this.handleError));
  }

  obtenerDepartamentos(): Observable<any> {
    return this.clientService.get<any>(this.apiUrlDep).pipe(
      catchError(this.handleError));
  }
  
  obtenerDepartamento(departamento_id: number): Observable<Usuario> {
    return this.clientService
      .get<Usuario>(`${this.apiUrlDep}?id=${departamento_id}`).pipe(
        catchError(this.handleError));
  }

  obtenerUsuario(id: number): Observable<Usuario> {
    return this.clientService
      .get<Usuario>(`${this.apiUrl}?id=${id}`).pipe(
        catchError(this.handleError));
  }

  actualizarUsuario(usuario: Usuario): Observable<any> {
    return this.clientService.put<any>(`${this.apiUrl}`, usuario).pipe(
      catchError(this.handleError));
  }

  eliminarUsuario(id: number): Observable<any> {
    return this.clientService.delete<any>(`${this.apiUrl}?id=${id}`).pipe(
      catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Un error desconocido ha ocurrido';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código de error ${error.status}, ` +
                     `mensaje: ${error.error.message || error.statusText}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
