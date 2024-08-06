
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UsuarioService, Usuario } from '../usuario.service';
import { Subscription } from 'rxjs';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private secretKey = 'X9f2Kp7Lm3Qr8Zw5Yt6Vb1Nj4Hg'; //28 caracteres

  LoginForm: FormGroup;
  LogoutForm: FormGroup;
  tokenCheckSubscription?: Subscription;
  token: string | null;

  creaciontoken?: string | null;

  constructor(private formulario: FormBuilder, private srvUsuario: UsuarioService) {
    this.LoginForm = this.formulario.group({
      correo: [''],
      contrasena: ['']
    });

    this.LogoutForm = this.formulario.group({
      token: [''],
      token_cookie: ['']
    });

    this.token = localStorage.getItem('token');
  }

  ngOnInit() {
      
  }

  private encrypt(value: string): string {
    return CryptoJS.AES.encrypt(value, this.secretKey).toString();
  }

  onSubmitLogin() {
    if (!this.token) {
      const formData: Usuario = this.LoginForm.value;
      console.log('Datos de formulario:', this.LoginForm.value);
      this.srvUsuario.IniciarSesion(formData).subscribe(
        res => {
          console.log('Respuesta del servidor:', res);
          
          if (res && res.token && res.usuario) {
            // Encriptar y almacenar el token
            const encryptedToken = this.encrypt(res.token);
            localStorage.setItem('token', encryptedToken);

            // Encriptar y almacenar el rol
            const rolString = res.usuario.rol_id.toString();
            const encryptedRol = this.encrypt(rolString);
            localStorage.setItem('rol', encryptedRol);
  
            // Encriptar y almacenar el departamento
            const deptoString = res.usuario.departamento_id.toString();
            const encryptedDepartamento = this.encrypt(deptoString);
            localStorage.setItem('depa', encryptedDepartamento);
  
            window.location.href = "/admin/principal_admin";
          } else {
            console.error('La respuesta del servidor no tiene la estructura esperada');
          }
        },
        err => {
          console.error('Error al iniciar sesión', err);
        }
      );
  
      this.LoginForm.reset();
    } else {
      console.log('Ya tiene una sesión activa');
    }
  }

}
