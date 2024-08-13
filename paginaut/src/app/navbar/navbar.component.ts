import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Table,TableModule } from 'primeng/table';
import Swal from 'sweetalert2';
import { UsuarioService, Usuario, Logout } from '../usuario.service';

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



  ngOnInit() {
    
  }

  onSubmitLogout() {
    if (this.token) {
      this.LogoutForm.patchValue({
        token: this.token,
      });

      const formData: Logout = this.LogoutForm.value;
      //console.log(this.LogoutForm.value);

      this.srvUsuario.CerrarSesion(formData).subscribe(
        res => {
          //console.log(res);
          //console.log('Has cerrado sesión');
          localStorage.removeItem('token');
              localStorage.removeItem('rol');
              localStorage.removeItem('depa');
            this.srvUsuario.EliminarToken(formData).subscribe(res=>{
              //console.log("se elimono el token de la base de datos");
            });
          this.token = null;
          this.showToast('success', 'Sesión cerrada correctamente');
            setInterval(()=>{
              window.location.href = "/principal";
            },2000)
        },
        err => {
          //console.log('Error al cerrar sesión', err);
        }
      );

    } else {
      //console.log('No hay token para cerrar sesión');
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
