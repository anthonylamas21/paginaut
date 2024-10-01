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
    { url: './assets/img/galeria/turismo/turismo2.jpg', alt: '' },
    { url: './assets/img/galeria/turismo/turismo3.jpg', alt: '' },
    { url: './assets/img/galeria/turismo/turismo4.jpg', alt: '' },
    { url: './assets/img/galeria/turismo/turismo5.jpg', alt: '' },
    { url: './assets/img/galeria/turismo/turismo6.jpg', alt: '' },
    { url: './assets/img/galeria/turismo/turismo7.jpg', alt: '' },
    { url: './assets/img/galeria/turismo/turismo8.jpg', alt: '' },
    { url: './assets/img/galeria/turismo/turismo9.jpg', alt: '' },
    { url: './assets/img/galeria/turismo/turismo10.jpg', alt: '' },
    { url: './assets/img/galeria/turismo/TUR_1.jpg', alt: '' },
    { url: './assets/img/galeria/turismo/TUR_2.jpg', alt: '' },
    { url: './assets/img/galeria/turismo/TUR_3.jpg', alt: '' },
    { url: './assets/img/galeria/turismo/TUR_4.jpg', alt: '' },
    { url: './assets/img/galeria/turismo/TUR_5.jpg', alt: '' },
    { url: './assets/img/galeria/turismo/TUR_6.jpg', alt: '' },
    { url: './assets/img/galeria/turismo/TUR_7.jpg', alt: '' },
    { url: './assets/img/galeria/turismo/TUR_8.jpg', alt: '' },
    { url: './assets/img/galeria/turismo/TUR_9.jpg', alt: '' },
    { url: './assets/img/galeria/turismo/TUR_10.jpg', alt: '' },
    { url: './assets/img/galeria/turismo/TUR_11.jpg', alt: '' },
    { url: './assets/img/galeria/turismo/TUR_12.jpg', alt: '' },
    { url: './assets/img/galeria/turismo/TUR_13.jpg', alt: '' },
    { url: './assets/img/galeria/turismo/TUR_14.jpg', alt: '' },
    { url: './assets/img/galeria/turismo/TUR_15.jpg', alt: '' },
    { url: './assets/img/galeria/turismo/TUR_16.jpg', alt: '' },
    { url: './assets/img/galeria/turismo/TUR_17.jpg', alt: '' },
    { url: './assets/img/galeria/turismo/TUR_18.jpg', alt: '' },
    { url: './assets/img/galeria/turismo/TUR_19.jpg', alt: '' },
    { url: './assets/img/galeria/turismo/TUR_20.jpg', alt: '' },
    { url: './assets/img/galeria/turismo/TUR_21.jpg', alt: '' },
    { url: './assets/img/galeria/turismo/TUR_22.jpg', alt: '' },
    { url: './assets/img/galeria/turismo/TUR_23.jpg', alt: '' },
    { url: './assets/img/galeria/turismo/TUR_24.jpg', alt: '' },
    { url: './assets/img/galeria/turismo/TUR_25.jpg', alt: '' },
    { url: './assets/img/galeria/turismo/TUR_26.jpg', alt: '' },
    { url: './assets/img/galeria/turismo/TUR_27.jpg', alt: '' },
    { url: './assets/img/galeria/turismo/TUR_28.jpg', alt: '' },

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
      nabvar.classList.add('bg-[#043D3D]');
    }
  }

  scrollToSection(sectionId: string): void {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  }

  @ViewChild('dt') dt: Table | undefined;

  items: Item[] = [
    {uno: 'Matemáticas I', dos: 'Estadística', tres: 'Métodos y técnicas de investigación', cuatro: 'Cadenas de valor de productos y servicios turísticos', cinco: 'Diseño de experiencias turísticas', seis: 'Estadia', siete: 'Economía Para El Turismo', ocho: 'Finanzas Para El Turismo', nueve: 'Desarrollo De Proyectos Para El Turismo I', diez: 'Desarrollo De Proyectos Para El Turismo II', once: 'Estadia'},

    {uno: 'Informática I', dos: 'Sustentabilidad en el Turismo', tres: 'Servicios de viaje', cuatro: 'Patrimonio y desarrollo turístico regional', cinco: 'Investigación aplicada al turismo', seis: 'Estadia', siete: 'Análisis E Interpretación De Información Para El Sector Turístico', ocho: 'Gestión Y Planificación Turística', nueve: 'Innovación Y Turismo Responsable', diez: 'Instrumentos Para El Desarrollo Sustentable', once: 'Estadia'},

    {uno: 'Introducción Al Turismo', dos: 'Servicios de Turismo cultural y de naturaleza', tres: 'Capital humano', cuatro: 'Turismo de naturaleza', cinco: 'Cultura y desarrollo turístico', seis: 'Estadia', siete: 'Calidad Y Responsabilidad Social', ocho: 'Control Administrativo En El Turismo', nueve: 'Mercadotecnia Estratégica', diez: 'Destinos Turísticos Inteligentes', once: 'Estadia'},

    {uno: 'Patrimonio natural y cultural', dos: 'Servicios de hospedaje y alimentos y bebidas', tres: 'Operaciones contables y financieras', cuatro: 'Capacitación y talento humano', cinco: 'Comercialización y herramientas digitales', seis: 'Estadia', siete: 'Desarrollo Del Capital Humano En La Organización', ocho: 'Inglés VII', nueve: 'Inglés VIII', diez: 'Integradora', once: 'Estadia'},

    {uno: 'Administración', dos: 'Gestión de la calidad', tres: 'Mercadotecnia de productos y servicios turísticos', cuatro: 'Animación sociocultural', cinco: 'Integradora II', seis: 'Estadia', siete: 'Inglés VI', ocho: 'Planeación y organización para el trabajo', nueve: 'Dirección De Equipos De Alto Rendimiento', diez: 'Inglés IX', once: 'Estadia'},

    {uno: 'Inglés I', dos: 'Inglés II', tres: 'Integradora I', cuatro: 'Inglés IV', cinco: 'Inglés V', seis: 'Estadia', siete: 'Administración Del Tiempo', ocho: '', nueve: '', diez: 'Negociación Empresarial', once: 'Estadia'},

    {uno: 'Expresión Oral Y Escrita I', dos: 'Formación Sociocultural II', tres: 'Inglés III', cuatro: 'Francés I', cinco: 'Francés II', seis: 'Estadia', siete: '', ocho: '', nueve: '', diez: '', once: 'Estadia'},

    {uno: 'Formación Sociocultural I', dos: '', tres: 'Formación Sociocultural III', cuatro: 'Formación Sociocultural IV', cinco: 'Expresión Oral Y Escrita II', seis: 'Estadia', siete: '', ocho: '', nueve: '', diez: '', once: 'Estadia'}
];

//INICIO TABLA CUATRIMESTRES
onMouseOver(columna: string, valor: any) {
  if(valor == ""){
    //console.log(`El elemento de la columna ${columna} con valor "NULO" fue seleccionado`);
  }else{
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
