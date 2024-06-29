import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  FormAccessLogin: FormGroup;

  constructor(public formulario:FormBuilder, public cs: LoginService){

    this.FormAccessLogin = this.formulario.group({
      email:[''],
      contrasenia:['']
    });
  }

  submitLogin(){
    //console.log("Hola mundo");
    const formData = new FormData();
    formData.append('email', this.FormAccessLogin.get('email')?.value);
    formData.append('contrasenia', this.FormAccessLogin.get('contrasenia')?.value);
    console.log('Datos del formulario:', this.FormAccessLogin.value);  

    this.cs.AccessLogin(formData).subscribe(
    (result) =>{
      console.log('Resultado:', result);
    },(error)=>{
      console.log('Error:', error);
    });
  }

}
