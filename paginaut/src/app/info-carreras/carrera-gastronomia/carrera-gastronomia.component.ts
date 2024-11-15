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
  selector: 'app-carrera-gastronomia',
  templateUrl: './carrera-gastronomia.component.html',
  styleUrl: './carrera-gastronomia.component.css'
})
export class CarreraGastronomiaComponent {
  currentTab: string = 'segment-1'; // Define el tab inicial
  isLoading = true;
  imagenAmpliada: string | null = null;
  selectedImage: Image = { url: '', alt: '' };

  selectedTab: string = 'segment-1'; // La pestaña por defecto al inicio

  selectTab(tabId: string): void {
    this.selectedTab = tabId;
  }

  constructor(private renderer: Renderer2) {}

  images: Image[] = [
    { url: './assets/img/galeria/gastro/gastro2.webp', alt: 'Image 2' },
    { url: './assets/img/galeria/gastro/gastro3.webp', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/gastro4.webp', alt: 'Image 2' },
    { url: './assets/img/galeria/gastro/gastro5.webp', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/gastro6.webp', alt: 'Image 2' },
    { url: './assets/img/galeria/gastro/gastro7.webp', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_1.webp', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_2.webp', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_3.webp', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_4.webp', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_5.webp', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_6.webp', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_7.webp', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_8.webp', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_9.webp', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_10.webp', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_11.webp', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_12.webp', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_13.webp', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_14.webp', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_15.webp', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_16.webp', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_17.webp', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_18.webp', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_19.webp', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_20.webp', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_21.webp', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_22.webp', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_23.webp', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_24.webp', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_25.webp', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_26.webp', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_27.webp', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_28.webp', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_29.webp', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_30.webp', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_31.webp', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_32.webp', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_33.webp', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_34.webp', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_35.webp', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_36.webp', alt: 'Image 1' },
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
    {uno: 'Desarrollo Humano y Valores', dos: 'Habilidades Socioemocionales y Manejo de Conflictos', tres: 'Desarrollo del Pensamiento y Toma de Decisiones', cuatro: 'Ética Profesional', cinco: 'Liderazgo de Equipos de Alto Desempeño', seis: 'Estadía', siete: 'Habilidades Gerenciales', ocho: 'Planeación y Administración del Trabajo', nueve: 'Desarrollo de Negocios Gastronómicos', diez: 'Estadía'},
    {uno: 'Introducción a la Gastronomía', dos: 'Estandarización de Platillos', tres: 'Costos y Presupuestos', cuatro: 'Francés I', cinco: 'Francés II', seis: 'Estadía', siete: 'Contabilidad', ocho: 'Análisis e Interpretación Financiera', nueve: 'Gestión de la Calidad en Procesos Gastronómicos', diez: 'Estadía'},
    {uno: 'Matemáticas Aplicadas a la Gastronomía', dos: 'Fundamentos de Nutrición', tres: 'Operación de Bar', cuatro: 'Administración de Alimentos y Bebidas', cinco: 'Metodología de la Investigación Aplicada a la Gastronomía', seis: 'Estadía', siete: 'Administración de Procesos Gastronómicos', ocho: 'Bebidas Destiladas Mexicanas', nueve: 'Mixología', diez: 'Estadía'},
    {uno: 'Seguridad e Higiene en los Alimentos', dos: 'Servicio de Alimentos y Bebidas', tres: 'Pastelería', cuatro: 'Mercadotecnia de Servicios Gastronómicos', cinco: 'Logística de Eventos', seis: 'Estadía', siete: 'Patrimonio Gastronómico de México', ocho: 'Ingeniería de Menú', nueve: 'Cocina Contemporánea', diez: 'Estadía'},
    {uno: 'Bases Culinarias I', dos: 'Bases Culinarias II', tres: 'Bases Culinarias III', cuatro: 'Fundamentos de Vitivinicultura', cinco: 'Conformación de Menús', seis: 'Estadía', siete: 'Cocina Asiática', ocho: 'Cocina Europea', nueve: 'Optativa', diez: 'Estadía'},
    {uno: 'Comunicación y Habilidades Digitales', dos: 'Panadería', tres: 'Proyecto Integrador I', cuatro: 'Repostería', cinco: 'Proyecto Integrador II', seis: 'Estadía', siete: 'Cocina Mexicana I', ocho: 'Cocina Mexicana II', nueve: 'Proyecto Integrador III', diez: 'Estadía'}
  ];

//INICIO TABLA CUATRIMESTRES
onMouseOver(columna: string, valor: any) {
  if(valor == ""){
    // console.log(`El elemento de la columna ${columna} con valor "NULO" fue seleccionado`);
  }else{
    // console.log(`El elemento de la columna ${columna} con valor "${valor}" fue seleccionado`);
  }
}

//FIN TABLA CUATRIMESTRES

  filterGlobal(event: Event) {
    const input = event.target as HTMLInputElement;
    if (this.dt) {
      this.dt.filterGlobal(input.value, 'contains');
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
