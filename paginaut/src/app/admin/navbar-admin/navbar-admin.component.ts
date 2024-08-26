import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Table,TableModule } from 'primeng/table';
import Swal from 'sweetalert2';
import { Logout, UsuarioService } from '../../usuario.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-navbar-admin',
  templateUrl: './navbar-admin.component.html',
  styleUrl: './navbar-admin.component.css'
})
export class NavbarAdminComponent {

  private secretKey = 'X9f2Kp7Lm3Qr8Zw5Yt6Vb1Nj4Hg'; // Usa una clave segura en producción

  myForm: FormGroup; 
  LogoutForm: FormGroup;
  selectedCustomers: any;
  token: string | null;

  constructor(private formulario: FormBuilder, private srvUsuario: UsuarioService) {
    this.myForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      age: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+$/)]),
      description: new FormControl('', [Validators.required]),
      file: new FormControl('', [Validators.required]),
      checkboxes: new FormControl('', [Validators.required]),
      radios: new FormControl('', [Validators.required])
    });

    this.LogoutForm = this.formulario.group({
      token: [''],
    });

    this.token = localStorage.getItem('token');
  }

  private decrypt(encrypted: string): string {
      return CryptoJS.AES.decrypt(encrypted, this.secretKey).toString(CryptoJS.enc.Utf8);
    }

  ngOnInit() {
    
  }

  onSubmitLogout() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres cerrar sesión?',
      icon: 'warning',
      iconColor: '#FD9B63',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#E5E7EB',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      focusCancel: true,
      didOpen: () => {
        const cancelButton = Swal.getCancelButton();
        if (cancelButton) {
          cancelButton.style.color = 'black';  // Cambia el color del texto del botón "Cancelar" a negro
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.logoutConfirmed();
      }
    });
  }
  

  logoutConfirmed() {
    if (this.token) {
      const tokenDesencriptado = this.decrypt(this.token);
      this.LogoutForm.patchValue({
        token: tokenDesencriptado,
      });

      const formData: Logout = this.LogoutForm.value;

      this.srvUsuario.CerrarSesion(formData).subscribe(
        res => {
          this.srvUsuario.EliminarToken(formData).subscribe(res => {
            localStorage.removeItem('token');
            localStorage.removeItem('rol');
            localStorage.removeItem('depa');
            this.token = null;
            window.location.href = "/principal";
          }, err => {
            console.log('Error al eliminar token de la base de datos', err);
          });
        },
        err => {
          console.log('Error al cerrar sesión', err);
        }
      );
    } else {
      console.log('No hay token para cerrar sesión');
    }
  }

}

// Define the TooltipManager class outside of the Angular component
class TooltipManager {
  static adjustTooltipPosition(button: HTMLElement, tooltip: HTMLElement): void {
      // Obtener dimensiones del botón y del tooltip
      const buttonRect = button.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();

      // Obtener dimensiones de la ventana
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // Calcular la posición preferida del tooltip
      const preferredLeft = buttonRect.left - tooltipRect.width / 2 + buttonRect.width / 2;
      const preferredTop = buttonRect.top - tooltipRect.height - 10; // Espacio entre el botón y el tooltip

      // Ajustar la posición si se sale de la pantalla hacia la izquierda
      let left = Math.max(preferredLeft, 0);

      // Ajustar la posición si se sale de la pantalla hacia arriba
      let top = Math.max(preferredTop, 0);

      // Ajustar la posición si el tooltip se sale de la pantalla hacia la derecha
      if (left + tooltipRect.width > windowWidth) {
          left = windowWidth - tooltipRect.width;
      }

      // Ajustar la posición si el tooltip se sale de la pantalla hacia abajo
      if (top + tooltipRect.height > windowHeight) {
          top = windowHeight - tooltipRect.height;
      }

      // Aplicar posición al tooltip
      tooltip.style.position = 'fixed';
      tooltip.style.top = `${top}px`;
      tooltip.style.left = `${left}px`;
  }
}
