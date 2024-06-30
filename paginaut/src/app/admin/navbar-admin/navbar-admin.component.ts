import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Table,TableModule } from 'primeng/table';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar-admin',
  templateUrl: './navbar-admin.component.html',
  styleUrl: './navbar-admin.component.css'
})
export class NavbarAdminComponent {
  myForm: FormGroup;
  selectedCustomers: any;
  constructor() {
    this.myForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      age: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+$/)]),
      description: new FormControl('', [Validators.required]),
      file: new FormControl('', [Validators.required]),
      checkboxes: new FormControl('', [Validators.required]),
      radios: new FormControl('', [Validators.required])
    });
  }



  ngOnInit() {
    // Inicializa Flasher
    
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
