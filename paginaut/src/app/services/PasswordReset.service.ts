import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from '../constans';

@Injectable({
  providedIn: 'root'
})
export class PasswordResetService {

  private apiUrl = API+'/api/send_reset_email';
  private apiUrlPass = API+'/api/reset_password';

  constructor(private http: HttpClient) { }

  checkEmail(email: string): Observable<any> {
  return this.http.get(this.apiUrl+`?email=${email}`)
  }

  sendResetEmail(data: { email: string, reset_token: string }): Observable<any> {
    return this.http.put(this.apiUrl, data );
  }

  VerifyCodeEmail(data: { email: string }): Observable<any>{
    return this.http.post(this.apiUrl, data)
  }

  sendCodeVerify(data: {codigo: string}): Observable<any> {
  return this.http.post(this.apiUrlPass, data);
  }

  sendResetPassword(data: { email: string, password: string }): Observable<any> {
    return this.http.put(this.apiUrlPass, data );
  }

}
