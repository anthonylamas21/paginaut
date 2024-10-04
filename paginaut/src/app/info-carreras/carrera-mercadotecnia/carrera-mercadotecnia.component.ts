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
  selector: 'app-carrera-mercadotecnia',
  templateUrl: './carrera-mercadotecnia.component.html',
  styleUrl: './carrera-mercadotecnia.component.css',
})
export class CarreraMercadotecniaComponent {
  currentTab: string = 'segment-1'; // Define el tab inicial

  isLoading = true;
  imagenAmpliada: string | null = null;
  selectedImage: Image = { url: '', alt: '' };

  constructor(private renderer: Renderer2) {}

  images: Image[] = [
    { url: './assets/img/galeria/merca/merca1.jpg', alt: '' },
    { url: './assets/img/galeria/merca/merca2.jpg', alt: '' },
    { url: './assets/img/galeria/merca/merca3.jpg', alt: '' },
    { url: './assets/img/galeria/merca/merca4.jpg', alt: '' },
    { url: './assets/img/galeria/merca/merca5.jpg', alt: '' },
    { url: './assets/img/galeria/merca/merca6.jpg', alt: '' },
    { url: './assets/img/galeria/merca/MERCA_1.jpg', alt: '' },
    { url: './assets/img/galeria/merca/MERCA_2.jpg', alt: '' },
    { url: './assets/img/galeria/merca/MERCA_3.jpg', alt: '' },
    { url: './assets/img/galeria/merca/MERCA_4.jpg', alt: '' },
    { url: './assets/img/galeria/merca/MERCA_5.jpg', alt: '' },
    { url: './assets/img/galeria/merca/MERCA_6.jpg', alt: '' },
    { url: './assets/img/galeria/merca/MERCA_7.jpg', alt: '' },
    { url: './assets/img/galeria/merca/MERCA_8.jpg', alt: '' },
    { url: './assets/img/galeria/merca/MERCA_9.jpg', alt: '' },
    { url: './assets/img/galeria/merca/MERCA_10.jpg', alt: '' },
    { url: './assets/img/galeria/merca/MERCA_11.jpg', alt: '' },
    { url: './assets/img/galeria/merca/MERCA_12.jpg', alt: '' },
    { url: './assets/img/galeria/merca/MERCA_13.jpg', alt: '' },
    { url: './assets/img/galeria/merca/MERCA_14.jpg', alt: '' },
    { url: './assets/img/galeria/merca/MERCA_15.jpg', alt: '' },
    { url: './assets/img/galeria/merca/MERCA_16.jpg', alt: '' },
    // más imágenes aquí
  ];

  ngAfterViewInit(): void {
    this.renderer.listen('window', 'load', () => {
      this.isLoading = false;
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
    allTabs.forEach((tab) => {
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
    allButtons.forEach((button) => {
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
      nabvar.classList.add('bg-[#043D3D]');
    }
  }

  scrollToSection(sectionId: string): void {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  }

  @ViewChild('dt') dt: Table | undefined;

  items: Item[] = [
    {
      uno: 'Inglés I',
      dos: 'Inglés II',
      tres: 'Inglés III',
      cuatro: 'Inglés IV',
      cinco: 'Inglés V',
      seis: 'Estadía',
      siete: 'Inglés VI',
      ocho: 'Inglés VII',
      nueve: 'Inglés VIII',
      diez: 'Estadía',
    },
    {
      uno: 'Desarrollo Humano y Valores',
      dos: 'Habilidades Socioemocionales y Manejo de Conflictos',
      tres: 'Desarrollo del Pensamiento y Toma de Decisiones',
      cuatro: 'Ética Profesional',
      cinco: 'Liderazgo de Equipos de Alto Desempeño',
      seis: 'Estadía',
      siete: 'Habilidades Gerenciales',
      ocho: 'Mercadotecnia Digital II',
      nueve: 'Cultura Emprendedora',
      diez: 'Estadía',
    },
    {
      uno: 'Mercadotecnia',
      dos: 'Estadística I',
      tres: 'Legislación Comercial',
      cuatro: 'Mezcla Promocional',
      cinco: 'Logística y Distribución',
      seis: 'Estadía',
      siete: 'Estadística Aplicada a los Negocios',
      ocho: 'Inteligencia de Mercados',
      nueve: 'Cadena de Suministro',
      diez: 'Estadía',
    },
    {
      uno: 'Matemáticas',
      dos: 'Planeación Estratégica',
      tres: 'Estadística II',
      cuatro: 'Diseño Digital y Multimedia',
      cinco: 'Mercadotecnia de Servicios',
      seis: 'Estadía',
      siete: 'Mercadotecnia Internacional',
      ocho: 'Gestión de la Calidad',
      nueve: 'Plan de Negocios',
      diez: 'Estadía',
    },
    {
      uno: 'Informática',
      dos: 'Contabilidad para Negocios',
      tres: 'Sistema de Investigación de Mercados I',
      cuatro: 'Sistema de Investigación de Mercados II',
      cinco: 'Mercadotecnia Digital I',
      seis: 'Estadía',
      siete: 'Desarrollo de Nuevos Productos',
      ocho: 'Inteligencia Financiera',
      nueve: 'Comunicación Integral de la Mercadotecnia',
      diez: 'Estadía',
    },
    {
      uno: 'Fundamentos de Administración y Entorno Empresarial',
      dos: 'Comportamiento del Consumidor',
      tres: 'Estrategias de Producto y Precio',
      cuatro: 'Gestión de Ventas',
      cinco: 'Mercadotecnia Estratégica',
      seis: 'Estadía',
      siete: 'Tendencias del Mercado y Consumidor Global',
      ocho: 'Administración de la Producción',
      nueve: 'Derecho Corporativo',
      diez: 'Estadía',
    },
    {
      uno: 'Comunicación y Habilidades Digitales',
      dos: 'Economía',
      tres: 'Proyecto Integrador I',
      cuatro: 'Administración del Tiempo',
      cinco: 'Proyecto Integrador II',
      seis: 'Estadía',
      siete: 'Planeación y Organización del Trabajo',
      ocho: 'Gestión del Talento Humano',
      nueve: 'Proyecto Integrador III',
      diez: 'Estadía',
    },
  ];

  //INICIO TABLA CUATRIMESTRES
  onMouseOver(columna: string, valor: any) {
    if (valor == '') {
      //console.log(`El elemento de la columna ${columna} con valor "NULO" fue seleccionado`);
    } else {
      //console.log(`El elemento de la columna ${columna} con valor "${valor}" fue seleccionado`);
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
        const tooltipContent = tooltipElement.querySelector(
          '.hs-tooltip-content'
        );
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
  static adjustTooltipPosition(
    button: HTMLElement,
    tooltip: HTMLElement
  ): void {
    // Obtener dimensiones del botón y del tooltip
    const buttonRect = button.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    // Obtener dimensiones de la ventana
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Calcular la posición preferida del tooltip
    const preferredLeft =
      buttonRect.left - tooltipRect.width / 2 + buttonRect.width / 2;
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
