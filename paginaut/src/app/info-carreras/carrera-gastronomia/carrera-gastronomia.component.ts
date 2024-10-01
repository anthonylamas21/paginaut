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
  once: string;
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
    { url: './assets/img/galeria/gastro/gastro2.jpg', alt: 'Image 2' },
    { url: './assets/img/galeria/gastro/gastro3.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/gastro4.jpg', alt: 'Image 2' },
    { url: './assets/img/galeria/gastro/gastro5.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/gastro6.jpg', alt: 'Image 2' },
    { url: './assets/img/galeria/gastro/gastro7.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_1.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_2.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_3.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_4.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_5.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_6.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_7.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_8.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_9.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_10.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_11.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_12.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_13.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_14.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_15.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_16.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_17.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_18.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_19.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_20.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_21.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_22.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_23.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_24.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_25.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_26.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_27.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_28.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_29.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_30.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_31.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_32.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_33.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_34.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_35.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/gastro/GASTRO_36.jpg', alt: 'Image 1' },
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
      nabvar.classList.add('bg-[#043D3D]');
    }
  }

  scrollToSection(sectionId: string): void {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  }

  @ViewChild('dt') dt: Table | undefined;

  items: Item[] = [
    {uno: 'Matemáticas Aplicadas a la Gastronomía', dos: 'Estadística Aplicada a la Gastronomía', tres: 'Costos y Presupuestos', cuatro: 'Mercadotecnia de Servicios Gastronómicos', cinco: 'Métodos y Técnicas De Investigación Aplicadas a la Gastronomía', seis: 'Estadia', siete: 'Cocina Mexicana I', ocho: 'Cocina Mexicana II', nueve: 'Contabilidad', diez: 'Análisis e Interpretación Financiera', once: 'Estadia'},

    {uno: 'Informática', dos: 'Fundamentos de Nutrición', tres: 'Operación de Bar', cuatro: 'Fundamentos de Vitivinicultura', cinco: 'Evaluación de Servicios Gastronómicos', seis: 'Estadia', siete: 'Patrimonio Culinario de México', ocho: 'Cocina Europea', nueve: 'Cocina Asiática', diez: 'Cocina Contemporánea', once: 'Estadia'},

    {uno: 'Seguridad e Higiene en Alimentos', dos: 'Servicios de Alimentos y Bebidas', tres: 'Estandarización de Platillos', cuatro: 'Administración de Alimentos y Bebidas', cinco: 'Conformación de Menús', seis: 'Estadia', siete: 'Administración de Procesos Gastronómicos', ocho: 'Ingeniería de Menú', nueve: 'Conceptos Gastronómicos', diez: 'Gestión de la Calidad en Establecimientos de Alimentos y Bebidas', once: 'Estadia'},

    {uno: 'Introducción a la Gastronomía', dos: 'Métodos y Técnicas Culinarias', tres: 'Gestión de Compras y Almacén', cuatro: 'Repostería', cinco: 'Logística de Eventos', seis: 'Estadia', siete: 'Bebidas Destiladas Mexicanas', ocho: 'Inglés VII', nueve: 'Mixología', diez: 'Desarrollo de Negocios Gastronómicos', once: 'Estadia'},

    {uno: 'Bases Culinarias', dos: 'Panadería', tres: 'Pastelería', cuatro: 'Integradora I', cinco: 'Integradora II', seis: 'Estadia', siete: 'Inglés VI', ocho: 'Planeación y Organización del Trabajo', nueve: 'Inglés VIII', diez: 'Integradora', once: 'Estadia'},

    {uno: 'Inglés I', dos: 'Inglés II', tres: 'Inglés III', cuatro: 'Inglés IV', cinco: 'Inglés V', seis: 'Estadia', siete: 'Administración del tiempo', ocho: 'Dirección de Equipos de Alto Rendimiento', nueve: 'Inglés IX', diez: 'Negociación Empresarial', once: 'Estadia'},

    {uno: 'Expresión Oral Y Escrita I', dos: 'Formación Sociocultural II', tres: 'Formación Sociocultural III', cuatro: 'Francés I', cinco: 'Francés II', seis: 'Estadia', siete: '', ocho: '', nueve: '', diez: '', once: 'Estadia'},

    {uno: 'Formación Sociocultural I', dos: '', tres: '', cuatro: 'Formación Sociocultural IV', cinco: 'Expresión Oral Y Escrita II', seis: 'Estadia', siete: '', ocho: '', nueve: '', diez: '', once: 'Estadia'}
]
;

//INICIO TABLA CUATRIMESTRES
onMouseOver(columna: string, valor: any) {
  if(valor == ""){
    //console.log(`El elemento de la columna ${columna} con valor "NULO" fue seleccionado`);
  }else{
    //console.log(`El elemento de la columna ${columna} con valor "${valor}" fue seleccionado`);
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
