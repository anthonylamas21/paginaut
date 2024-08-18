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
          html: `
          <div class="flex justify-center gap-2 mb-6">
            <input id="otp1" class="w-12 h-12 text-center border rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500" type="text" maxlength="1" pattern="[0-9]" inputmode="numeric" autocomplete="one-time-code" required>
            <input id="otp2" class="w-12 h-12 text-center border rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500" type="text" maxlength="1" pattern="[0-9]" inputmode="numeric" autocomplete="one-time-code" required>
            <input id="otp3" class="w-12 h-12 text-center border rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500" type="text" maxlength="1" pattern="[0-9]" inputmode="numeric" autocomplete="one-time-code" required>
            <input id="otp4" class="w-12 h-12 text-center border rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500" type="text" maxlength="1" pattern="[0-9]" inputmode="numeric" autocomplete="one-time-code" required>
            <input id="otp5" class="w-12 h-12 text-center border rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500" type="text" maxlength="1" pattern="[0-9]" inputmode="numeric" autocomplete="one-time-code" required>
            <input id="otp6" class="w-12 h-12 text-center border rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500" type="text" maxlength="1" pattern="[0-9]" inputmode="numeric" autocomplete="one-time-code" required>
          </div>
        `,
        didOpen: () => {
          // Set focus to the first input
          const otp1 = document.getElementById('otp1') as HTMLInputElement;
          const otp2 = document.getElementById('otp2') as HTMLInputElement;
          const otp3 = document.getElementById('otp3') as HTMLInputElement;
          const otp4 = document.getElementById('otp4') as HTMLInputElement;
          const otp5 = document.getElementById('otp5') as HTMLInputElement;
          const otp6 = document.getElementById('otp6') as HTMLInputElement;
      
          otp1?.focus();
      
          const moveToNext = (currentElement: HTMLInputElement, nextElement: HTMLInputElement) => {
            currentElement.addEventListener('input', () => {
              if (currentElement.value.length === 1) {
                nextElement.focus();
              }
            });
          };
      
          const moveToPrevious = (currentElement: HTMLInputElement, previousElement: HTMLInputElement) => {
            currentElement.addEventListener('keydown', (event) => {
              if (event.key === 'Backspace' && currentElement.value.length === 0) {
                previousElement.focus();
              }
            });
          };
      
          // Apply the focus transitions
          moveToNext(otp1, otp2);
          moveToNext(otp2, otp3);
          moveToNext(otp3, otp4);
          moveToNext(otp4, otp5);
          moveToNext(otp5, otp6);
          moveToPrevious(otp2, otp1);
          moveToPrevious(otp3, otp2);
          moveToPrevious(otp4, otp3);
          moveToPrevious(otp5, otp4);
          moveToPrevious(otp6, otp5);
        },
        }).then((result) => {
          if (result.isConfirmed) {
            const otp1 = (document.getElementById('otp1') as HTMLInputElement).value;
            const otp2 = (document.getElementById('otp2') as HTMLInputElement).value;
            const otp3 = (document.getElementById('otp3') as HTMLInputElement).value;
            const otp4 = (document.getElementById('otp4') as HTMLInputElement).value;
            const otp5 = (document.getElementById('otp5') as HTMLInputElement).value;
            const otp6 = (document.getElementById('otp6') as HTMLInputElement).value;
        
            const codigo = `${otp1}${otp2}${otp3}${otp4}${otp5}${otp6}`;
            console.log('Código ingresado:', codigo);
           

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
