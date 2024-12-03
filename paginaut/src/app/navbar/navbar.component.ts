import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Table,TableModule } from 'primeng/table';
import Swal from 'sweetalert2';
import { UsuarioService, Usuario, Logout } from '../usuario.service';
import * as CryptoJS from 'crypto-js';
import { TooltipManager } from '../validaciones';

interface Item {
  nombre: string;
  edad: string;
  direccion: string;
}
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent  implements OnInit {
  isNavbarGreen: boolean = false;

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

  ngOnInit(): void {
    this.checkToken();

    // Escuchar el evento storage para detectar cambios en el localStorage
    window.addEventListener('storage', () => {
      this.checkToken();
    });
  }

  toggleNavbar(): void {
    this.isNavbarGreen = !this.isNavbarGreen;
  }

  checkToken(): void {
    const token = localStorage.getItem('token');
    const hasReloaded = localStorage.getItem('hasReloaded');

    if (!token && !hasReloaded) {
      // Si no hay token y no se ha recargado antes, recargar la página
      localStorage.setItem('hasReloaded', 'true');  // Marcar como recargado
      window.location.reload();
    } else if (token) {
      // Si hay token, resetear el estado de recarga
      localStorage.removeItem('hasReloaded');
    }
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
            // console.log('Error al eliminar token de la base de datos', err);
          });
        },
        err => {
          // console.log('Error al cerrar sesión', err);
        }
      );
    } else {
      // console.log('No hay token para cerrar sesión');
    }
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
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: icon,
      title: title,
    });
  }

  mostrar(elemento: any): void {
    if (elemento.tagName.toLowerCase() === 'button' || elemento.tagName.toLowerCase() === 'a') {
      const tooltipElement = elemento.querySelector('.hs-tooltip');
      if (tooltipElement) {
        tooltipElement.classList.toggle('show');
        const tooltipContent = tooltipElement.querySelector('.hs-tooltip-content');
        if (tooltipContent) {
          tooltipContent.classList.toggle('hidden');
          tooltipContent.classList.toggle('invisible');
          tooltipContent.classList.toggle('visible');
          TooltipManager.adjustTooltipPosition(elemento, tooltipContent);
        }
      }
    }
  }
}