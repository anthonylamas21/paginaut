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
  selector: 'app-carrera-turismo',
  templateUrl: './carrera-turismo.component.html',
  styleUrl: './carrera-turismo.component.css'
})
export class CarreraTurismoComponent {
  currentTab: string = 'segment-1'; // Define el tab inicial
  isLoading = true;
  imagenAmpliada: string | null = null;
  selectedImage: Image = { url: '', alt: '' };

  constructor(private renderer: Renderer2) {}

  images: Image[] = [
    { url: './assets/img/galeria/turismo/turismo2.webp', alt: '' },
    { url: './assets/img/galeria/turismo/turismo3.webp', alt: '' },
    { url: './assets/img/galeria/turismo/turismo4.webp', alt: '' },
    { url: './assets/img/galeria/turismo/turismo5.webp', alt: '' },
    { url: './assets/img/galeria/turismo/turismo6.webp', alt: '' },
    { url: './assets/img/galeria/turismo/turismo7.webp', alt: '' },
    { url: './assets/img/galeria/turismo/turismo8.webp', alt: '' },
    { url: './assets/img/galeria/turismo/turismo9.webp', alt: '' },
    { url: './assets/img/galeria/turismo/turismo10.webp', alt: '' },
    { url: './assets/img/galeria/turismo/TUR_1.webp', alt: '' },
    { url: './assets/img/galeria/turismo/TUR_2.webp', alt: '' },
    { url: './assets/img/galeria/turismo/TUR_3.webp', alt: '' },
    { url: './assets/img/galeria/turismo/TUR_4.webp', alt: '' },
    { url: './assets/img/galeria/turismo/TUR_5.webp', alt: '' },
    { url: './assets/img/galeria/turismo/TUR_6.webp', alt: '' },
    { url: './assets/img/galeria/turismo/TUR_7.webp', alt: '' },
    { url: './assets/img/galeria/turismo/TUR_8.webp', alt: '' },
    { url: './assets/img/galeria/turismo/TUR_9.webp', alt: '' },
    { url: './assets/img/galeria/turismo/TUR_10.webp', alt: '' },
    { url: './assets/img/galeria/turismo/TUR_11.webp', alt: '' },
    { url: './assets/img/galeria/turismo/TUR_12.webp', alt: '' },
    { url: './assets/img/galeria/turismo/TUR_13.webp', alt: '' },
    { url: './assets/img/galeria/turismo/TUR_14.webp', alt: '' },
    { url: './assets/img/galeria/turismo/TUR_15.webp', alt: '' },
    { url: './assets/img/galeria/turismo/TUR_16.webp', alt: '' },
    { url: './assets/img/galeria/turismo/TUR_17.webp', alt: '' },
    { url: './assets/img/galeria/turismo/TUR_18.webp', alt: '' },
    { url: './assets/img/galeria/turismo/TUR_19.webp', alt: '' },
    { url: './assets/img/galeria/turismo/TUR_20.webp', alt: '' },
    { url: './assets/img/galeria/turismo/TUR_21.webp', alt: '' },
    { url: './assets/img/galeria/turismo/TUR_22.webp', alt: '' },
    { url: './assets/img/galeria/turismo/TUR_23.webp', alt: '' },
    { url: './assets/img/galeria/turismo/TUR_24.webp', alt: '' },
    { url: './assets/img/galeria/turismo/TUR_25.webp', alt: '' },
    { url: './assets/img/galeria/turismo/TUR_26.webp', alt: '' },
    { url: './assets/img/galeria/turismo/TUR_27.webp', alt: '' },
    { url: './assets/img/galeria/turismo/TUR_28.webp', alt: '' },

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
      nabvar.classList.add('bg-primary-color');
    }
  }

  scrollToSection(sectionId: string): void {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  }

  @ViewChild('dt') dt: Table | undefined;

  items: Item[] = [
    {uno: 'Inglés I', dos: 'Inglés II', tres: 'Inglés III', cuatro: 'Inglés IV', cinco: 'Inglés V', seis: 'Estadía', siete: 'Inglés VI', ocho: 'Inglés VII', nueve: 'Inglés VIII', diez: 'Estadía'},
    {uno: 'Desarrollo Humano y Valores', dos: 'Habilidades Socioemocionales y Manejo de Conflictos', tres: 'Desarrollo del Pensamiento y Toma de Decisiones', cuatro: 'Ética Profesional', cinco: 'Liderazgo de Equipos de Alto Desempeño', seis: 'Estadía', siete: 'Habilidades Gerenciales', ocho: 'Finanzas para el Turismo', nueve: 'Seminario de Investigación Aplicada al Turismo', diez: 'Estadía'},
    {uno: 'Matemáticas Aplicadas en el Turismo', dos: 'Probabilidad y Estadística', tres: 'Contabilidad Aplicada al Turismo', cuatro: 'Diagnóstico Turístico', cinco: 'Diseño de Experiencias Turísticas', seis: 'Estadía', siete: 'Análisis e Interpretación de Información para el Sector Turístico', ocho: 'Calidad y Responsabilidad Social', nueve: 'Destinos Turísticos Inteligentes', diez: 'Estadía'},
    {uno: 'Fundamentos de Economía', dos: 'Administración', tres: 'Gestión de la Calidad', cuatro: 'Mercadotecnia y Comercialización', cinco: 'Plan de Negocios', seis: 'Estadía', siete: 'Economía para el Turismo', ocho: 'Desarrollo de Proyectos Emprendedores para el Turismo I', nueve: 'Desarrollo de Proyectos Emprendedores para el Turismo II', diez: 'Estadía'},
    {uno: 'Introducción al Turismo', dos: 'Servicios de Viaje y Transportación', tres: 'Hospitalidad y Alojamiento', cuatro: 'Operación de Servicios de Hospedaje', cinco: 'Animación Turística y Sociocultural', seis: 'Estadía', siete: 'Desarrollo Regional', ocho: 'Mercadotecnia Digital', nueve: 'Dirección y Logística de Eventos', diez: 'Estadía'},
    {uno: 'Geografía y Patrimonio', dos: 'Sustentabilidad en el Turismo', tres: 'Capital Humano', cuatro: 'Turismo Cultural y de Naturaleza', cinco: 'Capacitación de Capital Humano', seis: 'Estadía', siete: 'Instrumentos para el Desarrollo Sustentable', ocho: 'Consultoría Turística I', nueve: 'Consultoría Turística II', diez: 'Estadía'},
    {uno: 'Comunicación y Habilidades Digitales', dos: 'Servicios de Alimentos y Bebidas', tres: 'Proyecto Integrador I', cuatro: 'Operación de Servicios de Alimentos y Bebidas', cinco: 'Proyecto Integrador II', seis: 'Estadía', siete: 'Gestión y Planificación del Turismo', ocho: 'Tendencias del Turismo', nueve: 'Proyecto Integrador III', diez: 'Estadía'}
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
