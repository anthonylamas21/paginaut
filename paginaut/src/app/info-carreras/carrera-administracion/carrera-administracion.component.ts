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
  selector: 'app-carrera-administracion',
  templateUrl: './carrera-administracion.component.html',
  styleUrl: './carrera-administracion.component.css',
})
export class CarreraAdministracionComponent {
  currentTab: string = 'segment-1'; // Define el tab inicial
  isLoading = true;
  imagenAmpliada: string | null = null;
  selectedImage: Image = { url: '', alt: '' };

  constructor(private renderer: Renderer2) {}

  images: Image[] = [
    { url: './assets/img/galeria/admin/admin1.webp', alt: '' },
    { url: './assets/img/galeria/admin/admin2.webp', alt: '' },
    { url: './assets/img/galeria/admin/admin3.webp', alt: '' },
    { url: './assets/img/galeria/admin/admin4.webp', alt: '' },
    { url: './assets/img/galeria/admin/admin5.webp', alt: '' },
    { url: './assets/img/galeria/admin/admin6.webp', alt: '' },
    { url: './assets/img/galeria/admin/admin7.webp', alt: '' },
    { url: './assets/img/galeria/admin/admin8.webp', alt: '' },
    { url: './assets/img/galeria/admin/admin9.webp', alt: '' },
    { url: './assets/img/galeria/admin/admin10.webp', alt: '' },
    { url: './assets/img/galeria/admin/admin11.webp', alt: '' },
    { url: './assets/img/galeria/admin/admin12.webp', alt: '' },
    { url: './assets/img/galeria/admin/admin13.webp', alt: '' },
    { url: './assets/img/galeria/admin/ADMIN_1.webp', alt: '' },
    { url: './assets/img/galeria/admin/ADMIN_2.webp', alt: '' },
    { url: './assets/img/galeria/admin/ADMIN_3.webp', alt: '' },
    { url: './assets/img/galeria/admin/ADMIN_4.webp', alt: '' },
    { url: './assets/img/galeria/admin/ADMIN_5.webp', alt: '' },
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
      ocho: 'Dirección Estratégica',
      nueve: 'Comercio y Logística Internacional',
      diez: 'Estadía',
    },
    {
      uno: 'Fundamentos Matemáticos',
      dos: 'Probabilidad y Estadística',
      tres: 'Fundamentos de Mercadotecnia',
      cuatro: 'Gestión del Capital Humano',
      cinco: 'Desarrollo del Capital Humano',
      seis: 'Estadía',
      siete: 'Mercadotecnia Estratégica',
      ocho: 'Investigación de Operaciones',
      nueve: 'Consultoría Empresarial',
      diez: 'Estadía',
    },
    {
      uno: 'Contabilidad I',
      dos: 'Contabilidad II',
      tres: 'Análisis Financiero',
      cuatro: 'Integración del Capital Humano',
      cinco: 'Seguridad e Higiene Laboral',
      seis: 'Estadía',
      siete: 'Tecnologías Aplicadas a los Negocios',
      ocho: 'Sistemas de la Información Aplicados en la Organización',
      nueve: 'Gestión de la Propiedad Intelectual',
      diez: 'Estadía',
    },
    {
      uno: 'Fundamentos de Administración',
      dos: 'Planeación Estratégica',
      tres: 'Fundamentos de Calidad',
      cuatro: 'Comportamiento Organizacional',
      cinco: 'Desarrollo Organizacional',
      seis: 'Estadía',
      siete: 'Proyectos de Innovación Sostenibles',
      ocho: 'Modelos de Negocios',
      nueve: 'Desarrollo en Proyectos de Emprendimiento Social',
      diez: 'Estadía',
    },
    {
      uno: 'Marco Legal de las Organizaciones',
      dos: 'Microeconomía',
      tres: 'Macroeconomía',
      cuatro: 'Suelos y Salarios I',
      cinco: 'Suelos y Salarios II',
      seis: 'Estadía',
      siete: 'Gestión del Talento Humano',
      ocho: 'Evaluación en el Desempeño del Capital Humano',
      nueve: 'Finanzas Corporativas',
      diez: 'Estadía',
    },
    {
      uno: 'Comunicación y Habilidades Digitales',
      dos: 'Derecho Corporativo',
      tres: 'Proyecto Integrador I',
      cuatro: 'Legislación Laboral',
      cinco: 'Proyecto Integrador II',
      seis: 'Estadía',
      siete: 'Administración de la Producción',
      ocho: 'Administración y Gestión de la Calidad',
      nueve: 'Proyecto Integrador III',
      diez: 'Estadía',
    },
  ];

  //INICIO TABLA CUATRIMESTRES
  onMouseOver(columna: string, valor: any) {
    if (valor == '') {
      // console.log(`El elemento de la columna ${columna} con valor "NULO" fue seleccionado`);
    } else {
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
