import { Component, HostListener, Renderer2, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';


interface Item {
  uno: string;
  dos: string;
  tres: string;
  cuatro: string;
  cinco: string;
  seis: string;
  siete: string;
  ocho: string;
  nueve: string;
  diez: string;
} 

interface Image {
  url: string;
  alt: string;
}
@Component({
  selector: 'app-carrera-contaduria',
  templateUrl: './carrera-contaduria.component.html',
  styleUrl: './carrera-contaduria.component.css'
})
export class CarreraContaduriaComponent {
  currentTab: string = 'segment-1'; // Define el tab inicial
  isLoading = true;
  imagenAmpliada: string | null = null;
  selectedImage: Image = { url: '', alt: '' };
  
  constructor(private renderer: Renderer2) {}

  images: Image[] = [
    { url: './assets/img/galeria/contaduria/contaduria1.webp', alt: 'Image 1' },
     { url: './assets/img/galeria/contaduria/CONTA_2.webp', alt: 'Image 2' },
    { url: './assets/img/galeria/contaduria/contaduria2.webp', alt: 'Image 2' },
    { url: './assets/img/galeria/contaduria/CONTA_1.webp', alt: 'Image 1' },
    // más imágenes aquí
  ];

  ngAfterViewInit(): void {
    this.renderer.listen('window', 'load', () => {
        this.isLoading = false
    });
  }
  ngOnInit(): void {
    this.setNavbarColor();
    this.showTab(this.currentTab); // Mostrar el tab inicial
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.setNavbarColor();
  }
      // Método para cambiar de pestaña
      showTab(tabId: string): void {
        // Oculta todas las pestañas
        const allTabs = document.querySelectorAll('[role="tabpanel"]');
        allTabs.forEach(tab => {
          tab.classList.add('hidden'); // Oculta todas
        });
  
        // Muestra la pestaña actual
        const activeTab = document.getElementById(tabId);
        if (activeTab) {
          activeTab.classList.remove('hidden');
        }
  
        // Cambiar el tab actual
        this.currentTab = tabId;
      }
  
      // Manejador de clics para los botones de las pestañas
      onTabClick(event: any, tabId: string): void {
        this.showTab(tabId);
  
        // Elimina la clase 'active' de todos los botones
        const allButtons = document.querySelectorAll('[role="tab"]');
        allButtons.forEach(button => {
          button.classList.remove('active');
        });
  
        // Agrega la clase 'active' al botón clicado
        event.target.classList.add('active');
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

  @ViewChild('dt') dt: Table | undefined;

  items: Item[] = [
    {uno: 'Inglés I', dos: 'Inglés II', tres: 'Inglés III', cuatro: 'Inglés IV', cinco: 'Inglés V', seis: 'Estadía', siete: 'Inglés VI', ocho: 'Inglés VII', nueve: 'Inglés VIII', diez: 'Estadía'},
    {uno: 'Desarrollo Humano y Valores', dos: 'Habilidades Socioemocionales y Manejo de Conflictos', tres: 'Desarrollo del Pensamiento y Toma de Decisiones', cuatro: 'Ética Profesional', cinco: 'Liderazgo de Equipos de Alto Desempeño', seis: 'Estadía', siete: 'Habilidades Gerenciales', ocho: 'Contabilidad Gubernamental', nueve: 'Auditoría Gubernamental', diez: 'Estadía'},
    {uno: 'Matemáticas para Negocios', dos: 'Estadística para Negocios', tres: 'Matemáticas Financieras', cuatro: 'Análisis e Interpretación de Estados Financieros', cinco: 'Fundamentos de Auditoría', seis: 'Estadía', siete: 'Mercado de Valores', ocho: 'Estructura de Capital', nueve: 'Evaluación Financiera', diez: 'Estadía'},
    {uno: 'Informática', dos: 'Derecho Laboral', tres: 'Derecho Fiscal', cuatro: 'Contribuciones de Personas Morales', cinco: 'Contribuciones de Personas Físicas', seis: 'Estadía', siete: 'Administración Financiera', ocho: 'Contabilidades Especiales', nueve: 'Auditoría Fiscal', diez: 'Estadía'},
    {uno: 'Fundamentos de Administración', dos: 'Derecho Mercantil y Civil', tres: 'Contabilidad de Sociedades', cuatro: 'Presupuestos', cinco: 'Sueldos y Salarios', seis: 'Estadía', siete: 'Seminario Fiscal de Personas Morales', ocho: 'Seminario Fiscal de Personas Físicas', nueve: 'Seminario de Defensa Fiscal', diez: 'Estadía'},
    {uno: 'Contabilidad Básica', dos: 'Contabilidad Intermedia', tres: 'Contabilidad Superior', cuatro: 'Contabilidad de Costos I', cinco: 'Contabilidad de Costos II', seis: 'Estadía', siete: 'Seminario Fiscal de Asociaciones y Sociedades Civiles', ocho: 'Seguridad Social', nueve: 'Administración de Costos e Inventarios para la Toma de Decisiones', diez: 'Estadía'},
    {uno: 'Comunicación y Habilidades Digitales', dos: 'Economía', tres: 'Proyecto Integrador I', cuatro: 'Comercio Exterior', cinco: 'Proyecto Integrador II', seis: 'Estadía', siete: 'Auditoría Financiera', ocho: 'Desarrollo Organizacional', nueve: 'Proyecto Integrador III', diez: 'Estadía'}
  ];

//INICIO TABLA CUATRIMESTRES
onMouseOver(columna: string, valor: any) {
  if(valor == ""){
    // console.log(`El elemento de la columna ${columna} con valor "NULO" fue seleccionado`);
  }else{
    // console.log(`El elemento de la columna ${columna} con valor "${valor}" fue seleccionado`);
  }
}

openModal(image: Image): void {
  this.selectedImage = image;
  const modal = document.getElementById('hs-vertically-centered-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('pointer-events-auto');
  }
}
closeModal(): void {
  const modal = document.getElementById('hs-vertically-centered-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('pointer-events-auto');
  }
  this.selectedImage = { url: '', alt: '' };
}

ampliarImagen(imagenUrl: string): void {
  this.imagenAmpliada = imagenUrl;
}

cerrarImagenAmpliada(): void {
  this.imagenAmpliada = null;
}

//FIN TABLA CUATRIMESTRES

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
