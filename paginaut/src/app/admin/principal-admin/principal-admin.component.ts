import { Component, OnInit, HostListener } from '@angular/core';
import { HistorialService } from '../../historial.service'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-principal-admin',
  templateUrl: './principal-admin.component.html',
  styleUrls: ['./principal-admin.component.css']
})
export class PrincipalAdminComponent implements OnInit {
  historial: any[] = [];  // Aquí se almacenarán los datos del historial
  isModalOpen: boolean = false;
  selectedItem: any = null;
  visibleItemsCount: number = 3;  // Número de elementos visibles inicialmente

  constructor(private historialService: HistorialService) { }

  ngOnInit(): void {
    this.setNavbarColor();
    this.loadHistorial();  // Carga los datos del historial
  }

  private loadHistorial(): void {
    this.historialService.getHistorial().subscribe(
      data => {
        this.historial = data;  // Carga todos los registros de historial
      },
      error => {
        console.error('Error al obtener el historial', error);
      }
    );
  }

  getTitle(item: any): string {
    return `Operación: ${this.capitalize(item.operacion)} en ${this.capitalize(item.tabla)}`;
  }

  getDescription(item: any): string {
    return `Operación: ${item.operacion} realizada en la tabla ${item.tabla}.`;
}


getDetallesEspecificos(item: any): string {
  let detalles = '';

  if (item.datos_anteriores) {
      const datos = item.datos_anteriores;
      for (const campo in datos) {
          if (datos.hasOwnProperty(campo)) {
              detalles += `<strong>${this.capitalize(campo.replace('_', ' '))}:</strong> ${datos[campo]}<br>`;
          }
      }
  }

  return detalles || 'No hay detalles disponibles.';
}


  openModal(item: any = null): void {
    this.selectedItem = item;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedItem = null;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }


  capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.setNavbarColor();
  }
  showMore(): void {
    this.visibleItemsCount += 3;  // Aumenta en 3 el número de elementos visibles
  }

  showLess(): void {
    if (this.visibleItemsCount > 3) {
      this.visibleItemsCount -= 3;  // Reduce en 3 el número de elementos visibles, pero no por debajo de 3
    }
  }
  parseDetails(item: any): Array<{ label: string, value: any }> {
    const details = [];
    if (item.datos_anteriores) {
      const datos = item.datos_anteriores;
      for (const campo in datos) {
        if (datos.hasOwnProperty(campo)) {
          let value = datos[campo];

          // Si el campo es una fecha, la formateamos
          if (campo.includes('fecha') || campo.includes('creacion')) {
            value = this.formatDate(value);
          }

          details.push({
            label: this.capitalize(campo.replace('_', ' ')),
            value: value
          });
        }
      }
    }
    return details;
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
}
