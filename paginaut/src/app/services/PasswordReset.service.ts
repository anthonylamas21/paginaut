import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PasswordResetService {

  private apiUrl = 'http://localhost/paginaut/api/send_reset_email.php';
  private apiUrlPass = 'http://localhost/paginaut/api/reset_password.php';

  constructor(private http: HttpClient) { }

  checkEmail(email: string): Observable<any> {
  return this.http.get(this.apiUrl+`?email=${email}`)
  }

  sendResetEmail(data: { email: string, reset_token: string }): Observable<any> {
    return this.http.put(this.apiUrl, data );
  }

  sendCodeVerify(data: {codigo: string}): Observable<any> {
  return this.http.post(this.apiUrlPass, data);
  }

  sendResetPassword(data: { email: string, password: string }): Observable<any> {
    return this.http.put(this.apiUrlPass, data );
  }

}
