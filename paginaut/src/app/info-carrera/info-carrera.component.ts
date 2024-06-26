import { Component, HostListener, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';


interface Item {
  nombre: string;
  edad: string;
  direccion: string;
}

@Component({
  selector: 'app-info-carrera',
  templateUrl: './info-carrera.component.html',
  styleUrl: './info-carrera.component.css'
})
export class InfoCarreraComponent {

  ngOnInit(): void {
    this.setNavbarColor();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.setNavbarColor();
  }

  private setNavbarColor(): void {
    const button = document.getElementById('scrollTopButton');
    const nabvar = document.getElementById('navbarAccion');
    const inicioSection = document.getElementById('inicio');

    if (inicioSection && nabvar) {
      const inicioSectionBottom = inicioSection.getBoundingClientRect().bottom;

      if (window.scrollY > inicioSectionBottom) {
        button?.classList.remove('hidden');
      } else {
        button?.classList.add('hidden');
      }
      
      nabvar.classList.remove('bg-transparent');
      nabvar.classList.add('bg-[#043D3D]');
    }
  }
  
  scrollToSection(sectionId: string): void {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  }

  @ViewChild('dt') dt: Table | undefined;

  items: Item[] = [
    { nombre: 'Juan Pérez', edad: '28', direccion: 'Calle Falsa 123, Ciudad A' },
    { nombre: 'María Gómez', edad: '34', direccion: 'Avenida Siempre Viva 456, Ciudad B' },
    { nombre: 'Carlos Sánchez', edad: '45', direccion: 'Boulevard de los Sueños Rotos 789, Ciudad C' },
    { nombre: 'Laura Martínez', edad: '23', direccion: 'Calle del Sol 101, Ciudad D' },
    { nombre: 'Pedro Jiménez', edad: '52', direccion: 'Avenida de la Luna 202, Ciudad E' },
    { nombre: 'Ana Rodríguez', edad: '29', direccion: 'Calle Estrella 303, Ciudad F' },
    { nombre: 'Luis Fernández', edad: '38', direccion: 'Avenida de las Flores 404, Ciudad G' },
    { nombre: 'Marta López', edad: '41', direccion: 'Calle del Río 505, Ciudad H' },
    { nombre: 'Jorge García', edad: '33', direccion: 'Boulevard del Mar 606, Ciudad I' },
    { nombre: 'Lucía Díaz', edad: '26', direccion: 'Avenida del Bosque 707, Ciudad J' },
    { nombre: 'Raúl Hernández', edad: '49', direccion: 'Calle de la Montaña 808, Ciudad K' },
    { nombre: 'Sofía Torres', edad: '31', direccion: 'Boulevard del Valle 909, Ciudad L' },
    { nombre: 'Andrés Castro', edad: '22', direccion: 'Calle de las Rosas 111, Ciudad M' },
    { nombre: 'Patricia Morales', edad: '27', direccion: 'Avenida de los Pinos 222, Ciudad N' },
    { nombre: 'Gabriel Romero', edad: '36', direccion: 'Calle de los Álamos 333, Ciudad O' }
];


  filterGlobal(event: Event) {
    const input = event.target as HTMLInputElement;
    if (this.dt) {
      this.dt.filterGlobal(input.value, 'contains');
    }
  }
  

  mostrar(elemento: any): void {
    // Verifica si el elemento recibido es un botón
    if (elemento.tagName.toLowerCase() === 'button') {
        const tooltipElement = elemento.querySelector('.hs-tooltip');
        if (tooltipElement) {
            tooltipElement.classList.toggle('show');
            const tooltipContent = tooltipElement.querySelector('.hs-tooltip-content');
            if (tooltipContent) {
                tooltipContent.classList.toggle('hidden');
                tooltipContent.classList.toggle('invisible');
                tooltipContent.classList.toggle('visible');
                // Ajustar la posición del tooltip
                TooltipManager.adjustTooltipPosition(elemento, tooltipContent);
            }
        }
    }
  }

}

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
