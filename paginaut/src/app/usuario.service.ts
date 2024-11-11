import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import * as CryptoJS from 'crypto-js';

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

  private secretKey = 'X9f2Kp7Lm3Qr8Zw5Yt6Vb1Nj4Hg'; // Usa una clave segura en producción

  token:  string | null;
  rol:  string | null;
  depa:  string | null;

  private URL = 'http://localhost/paginaut/api/usuario.php';  // Ajusta esta URL según tu configuración
  private URL_Login = 'http://localhost/paginaut/api/login.php';
  private URL_Logout = 'http://localhost/paginaut/api/deleteToken.php';
  private URL_DeleteToken = 'http://localhost/paginaut/api/logout.php';

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('token');
    this.rol = localStorage.getItem('rol');
    this.depa = localStorage.getItem('depa');
  }

  private decrypt(encrypted: string): string {
    return CryptoJS.AES.decrypt(encrypted, this.secretKey).toString(CryptoJS.enc.Utf8);
  }

  isAuth() {
    const encryptedToken = localStorage.getItem('token');
    const encryptedRol = localStorage.getItem('rol');
    const encryptedDepa = localStorage.getItem('depa');
  
    if (!encryptedToken || !encryptedRol) {
      return { isAuthenticated: false, rol: null, departamento: null };
    }
  
    const token = this.decrypt(encryptedToken);
    const rol = this.decrypt(encryptedRol);
  
    const isAuthenticated = token && token.length > 0;
    const isAdmin = rol === '1';
  
    return { 
      isAuthenticated, 
      isAdmin
    };
  }
  

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
    //console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

}
