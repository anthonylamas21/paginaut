
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UsuarioService, Usuario } from '../usuario.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

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

  onSubmitLogin() {
    if (!this.token) {
      const formData: Usuario = this.LoginForm.value;
      console.log(this.LoginForm.value);
      this.srvUsuario.IniciarSesion(formData).subscribe(
        res => {
          console.log(res);
          console.log('Has iniciado sesión');
          
          localStorage.setItem('token', res.token);
          this.creaciontoken = res.token;
          this.token = res.token;
          window.location.href = "/admin/principal_admin"
        },
        err => {
          console.log('Error al iniciar sesión', err);
        }
      );
  
      this.LoginForm.reset();
    } else {
      console.log('Ya tiene una sesión activa');
    }
  }



}
