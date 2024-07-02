import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';


export interface Usuario {
  id?: number;
  correo: string;
  contrasenia: string;
  rol_id: number;
  departamento_id: number;
  token_recuperacion: string;
  fecha_expiracion_token: string;
  activo?: boolean;
  fecha_creacion?: string;
}

export interface Logout {
  id?: number;
  correo?: string;
  token?: string;
}
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private URL = 'http://localhost/paginaut/api/usuario.php';  // Ajusta esta URL según tu configuración
  private URL_Login = 'http://localhost/paginaut/api/login.php';
  private URL_Logout = 'http://localhost/paginaut/api/deleteToken.php';
  private URL_DeleteToken = 'http://localhost/paginaut/api/logout.php';

  constructor(private http: HttpClient) { }

  crearUsuario(data: Usuario): Observable<any>{
    return this.http.post<any>(this.URL, data);
  }

  IniciarSesion(data: Usuario){
    return this.http.post<any>(this.URL_Login, data);
  }

  CerrarSesion(token: Logout): Observable<any>{
    return this.http.post<any>(this.URL_Logout, token);
  }

  EliminarToken(token: Logout): Observable<any> {
    return this.http.post(this.URL_DeleteToken, token );
  }
  
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Un error desconocido ha ocurrido';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // El backend retornó un código de error
      errorMessage = `Código de error ${error.status}, ` +
                     `mensaje: ${error.error.message || error.statusText}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

}
