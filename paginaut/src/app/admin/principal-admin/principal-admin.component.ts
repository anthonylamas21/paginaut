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
      }
    );
  }
  translateOperation(operation: string): string {
    const traducciones: { [key: string]: string } = {
      'create': 'Crear',
      'update': 'Actualizar',
      'delete': 'Eliminar',
      'view': 'Ver',
      // Agrega más traducciones según sea necesario
    };
    
    return traducciones[operation.toLowerCase()] || operation; // Devuelve la traducción o el original si no hay traducción
  }
  

  getTitle(item: any): string {
    const operacionTraducida = this.translateOperation(item.operacion);
    return `Operación: ${this.capitalize(operacionTraducida)} en ${this.capitalize(item.tabla)}`;
  }
  

  getDescription(item: any): string {
    const operacionTraducida = this.translateOperation(item.operacion);
    return `Operación: ${operacionTraducida} realizada en la tabla ${item.tabla}.`;
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
      nabvar.classList.add('bg-primary-color');
    }
  }

  scrollToSection(sectionId: string): void {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  }
}
