import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API } from './constans';

@Injectable({
  providedIn: 'root'
})
export class HistorialService {
  private apiUrl = API+'/api/historial';  // Cambia esto por la URL real de tu API

  constructor(private http: HttpClient) { }

  getHistorial(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
