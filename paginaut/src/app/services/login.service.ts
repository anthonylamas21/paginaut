import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from '../constans';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  URL = API+'/api/controller';

  reqHeader =  new HttpHeaders({
    'Authorization': 'Bearer '
  });

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }); 
  constructor(private http: HttpClient) { }

  AccessLogin(data: FormData): Observable<any> {
    return this.http.post<any>(this.URL+'login/', data, {headers:this.reqHeader});
  }
}
