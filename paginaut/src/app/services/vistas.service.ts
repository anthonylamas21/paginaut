import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VistasService {

private apiUrl = 'http://localhost/paginaut/api/visitas';

constructor(private http: HttpClient) { }

 // Método para registrar la visita con la IP
registrarVisitaConIp(ip: string): Observable<any> {
  const body = { direccion: ip };
  return this.http.post<any>(this.apiUrl, body);
}

ObtenerNumeroVisitas(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}`);
}

}
