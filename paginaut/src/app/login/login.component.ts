import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  FormAccessLogin: FormGroup;

  constructor(public formulario:FormBuilder){

    this.FormAccessLogin = this.formulario.group({
      email:[''],
      contrasenia:['']
    });
  }

  submitLogin(){

  }

}
