import { Component } from '@angular/core';
import { PasswordResetService } from './../services/PasswordReset.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Usuario } from '../usuario.service';
import { race } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.css',
})
export class PasswordResetComponent {

  EmailForm: FormGroup;
  ResetPassword: FormGroup;
  email?: string;
  codigo?: string;

  constructor(private passwordResetService: PasswordResetService, private formulario: FormBuilder) { 

    this.EmailForm = this.formulario.group({
      email: [''],
      reset_token: ['']
    });

    this.ResetPassword = this.formulario.group({
      password: [''],
      confirmPassword: ['']
    });
  }

  checkEmail() {

    const VerifyMail = this.EmailForm.get('email')?.value;

    this.passwordResetService.checkEmail(VerifyMail).subscribe(
      response => {
        console.log('Correo verificado');
        this.sendResetEmail();
      },
      error => {
        console.log('No existe el correo');
        // Muestra un mensaje de error al usuario
      });

  }

  sendResetEmail() {
    const resetToken = this.generateResetToken();
    this.EmailForm.patchValue({ reset_token: resetToken });

    // Envía los datos del formulario como un objeto JSON
    const requestData = {
      email: this.EmailForm.get('email')?.value,
      reset_token: this.EmailForm.get('reset_token')?.value
    };

    this.email = this.EmailForm.get('email')?.value;

    this.passwordResetService.sendResetEmail(requestData).subscribe(
      response => {
        this.showToast(
          'success',
          'Se le ha enviado el correo'
        );
        this.EmailForm.reset();

          // Agrega un breve retraso antes de mostrar el Swal
      setTimeout(() => {
        Swal.fire({
          title: 'Ingresa tu código de verificación',
          input: 'textarea',
          inputPlaceholder: 'Escribe tu código aquí...',
          showCancelButton: true,
          confirmButtonText: 'Enviar',
          cancelButtonText: 'Cancelar',
          allowOutsideClick: false
        }).then((result) => {
          if (result.isConfirmed) {
            console.log('Código ingresado:', result.value);
            const codigo = result.value;  
            console.log(codigo);

            const resetData = {
              codigo: codigo
            };

            this.passwordResetService.sendCodeVerify(resetData).subscribe(
            (result)=>{
              this.showToast(
                'success',
                'Código verificado'
              );

              Swal.fire({
                title: 'Ingresa tu nueva contraseña',
                html: `
                  <input type="password" id="password1" class="swal2-input" placeholder="Nueva contraseña">
                  <input type="password" id="password2" class="swal2-input" placeholder="Confirma tu contraseña">
                `,
                showCancelButton: true,
                confirmButtonText: 'Enviar',
                cancelButtonText: 'Cancelar',
                focusConfirm: false,
                allowOutsideClick: false,
                preConfirm: () => {
                  const password1 = (document.getElementById('password1') as HTMLInputElement).value;
                  const password2 = (document.getElementById('password2') as HTMLInputElement).value;
                  
                  if (!password1 || !password2) {
                    Swal.showValidationMessage('Ambos campos son obligatorios');
                    return false;
                  }
              
                  if (password1 !== password2) {
                    Swal.showValidationMessage('Las contraseñas no coinciden');
                    return false;
                  }
              
                  return { password1, password2 };
                }
              }).then((result) => {
                if (this.email) { // Asegúrate de que this.email no sea undefined
                  const requestPassword = {
                    email: this.email,
                    password: result.value?.password1
                  };
              
                  this.passwordResetService.sendResetPassword(requestPassword).subscribe(
                    response => {
                      this.showToast(
                        'success',
                        'Contraseña restablecida'
                      );
                      setTimeout(() => {
                        window.location.href = '/login'
                      }, 2000);
                    },
                    error => {
                      console.error('Error al restablecer la contraseña', error);
                    }
                  );
                } else {
                  console.error('El correo electrónico no está definido');
                }
              });
              

            }, (error) => {

            });

          }
        });
      }, 2000); // Retraso de 500ms antes de mostrar el Swal

      },
      error => {
        console.error('Error', error);
        // Muestra un mensaje de error al usuario
      }
    );
  }

  resetPassword() {
    const password = this.ResetPassword.get('password')?.value;
    const confirmPassword = this.ResetPassword.get('confirmPassword')?.value;
  
    if (password !== confirmPassword) {
      // Muestra un mensaje de error al usuario si las contraseñas no coinciden
      console.error('Las contraseñas no coinciden');
      return; // Detiene el proceso si no coinciden
    }
  
    this.passwordResetService.sendResetPassword(password).subscribe(
      response => {
        console.log('Contraseña restablecida', response);
        this.ResetPassword.reset();
        //logica para reslablecer contraseña
      },
      error => {
        console.error('Error', error);
        // Muestra un mensaje de error al usuario
      }
    );
  }

  private generateResetToken(): number {
    return Math.floor(100000 + Math.random() * 900000);
  }

  private showToast(
    icon: 'success' | 'warning' | 'error' | 'info' | 'question',
    title: string
  ): void {
    const Toast = Swal.mixin({
      toast: true,iconColor: '#008779',
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });

    Toast.fire({
      icon: icon,
      title: title,
    });
  }

}
