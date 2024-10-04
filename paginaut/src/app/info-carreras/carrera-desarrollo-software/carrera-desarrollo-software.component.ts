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
  selector: 'app-carrera-desarrollo-software',
  templateUrl: './carrera-desarrollo-software.component.html',
  styleUrl: './carrera-desarrollo-software.component.css'
})
export class CarreraDesarrolloSoftwareComponent {
  currentTab: string = 'segment-1'; // Define el tab inicial
  isLoading = true;
  imagenAmpliada: string | null = null;
  selectedImage: Image = { url: '', alt: '' };

  constructor(private renderer: Renderer2) {}

  images: Image[] = [
    { url: './assets/img/galeria/desarrollo/desarrollo1.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/desarrollo/desarrollo2.jpg', alt: 'Image 2' },
    { url: './assets/img/galeria/desarrollo/desarrollo3.jpg', alt: 'Image 3' },
    { url: './assets/img/galeria/desarrollo/desarrollo4.jpg', alt: 'Image 4' },
    { url: './assets/img/galeria/desarrollo/desarrollo5.jpg', alt: 'Image 5' },
    { url: './assets/img/galeria/desarrollo/desarrollo6.jpg', alt: 'Image 6' },
    { url: './assets/img/galeria/desarrollo/desarrollo7.jpg', alt: 'Image 7' },
    { url: './assets/img/galeria/desarrollo/desarrollo8.jpg', alt: 'Image 8' },
    { url: './assets/img/galeria/desarrollo/desarrollo9.jpg', alt: 'Image 9' },
    { url: './assets/img/galeria/desarrollo/desarrollo10.jpg', alt: 'Image 10' },
    { url: './assets/img/galeria/desarrollo/TIC_1.jpg', alt: '' },
    { url: './assets/img/galeria/desarrollo/TIC_3.jpg', alt: '' },
    { url: './assets/img/galeria/desarrollo/TIC_4.jpg', alt: '' },
    { url: './assets/img/galeria/desarrollo/TIC_5.jpg', alt: '' },
    { url: './assets/img/galeria/desarrollo/TIC_6.jpg', alt: '' },
    { url: './assets/img/galeria/desarrollo/TIC_7.jpg', alt: '' },
    { url: './assets/img/galeria/desarrollo/TIC_8.jpg', alt: '' },
    { url: './assets/img/galeria/desarrollo/TIC_9.jpg', alt: '' },
    { url: './assets/img/galeria/desarrollo/TIC_10.jpg', alt: '' },
    { url: './assets/img/galeria/desarrollo/TIC_11.jpg', alt: '' },
    { url: './assets/img/galeria/desarrollo/TIC_12.jpg', alt: '' },
    { url: './assets/img/galeria/desarrollo/TIC_13.jpg', alt: '' },
    { url: './assets/img/galeria/desarrollo/TIC_14.jpg', alt: '' },
    { url: './assets/img/galeria/desarrollo/TIC_15.jpg', alt: '' },
    { url: './assets/img/galeria/desarrollo/TIC_16.jpg', alt: '' },
    { url: './assets/img/galeria/desarrollo/TIC_17.jpg', alt: '' },
    { url: './assets/img/galeria/desarrollo/TIC_26.jpeg', alt: '' },
    { url: './assets/img/galeria/desarrollo/TIC_27.jpg', alt: '' },
    { url: './assets/img/galeria/desarrollo/TIC_33.jpeg', alt: '' },
    { url: './assets/img/galeria/desarrollo/TIC_34.jpeg', alt: '' },
    { url: './assets/img/galeria/desarrollo/TIC_35.jpeg', alt: '' },
    { url: './assets/img/galeria/desarrollo/TIC_37.png', alt: '' },
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
    {uno: 'FUNDAMENTOS DE REDES',
        dos: 'SISTEMAS OPERATIVOS',
        tres: 'TÓPICOS DE CALIDAD PARA EL DISEÑO DE SOFTWARE',
        cuatro: 'ÉTICA PROFESIONAL',
        cinco: 'INGLÉS V',
        seis: 'ESTADÍA',
        siete: 'HABILIDADES GERENCIALES',
        ocho: 'PROGRAMACIÓN PARA INTELIGENCIA ARTIFICIAL',
        nueve: 'TECNOLOGÍAS DISRUPTIVAS',
        diez: '',
        once: 'ESTADÍA'},

    {uno: 'FUNDAMENTOS DE PROGRAMACIÓN',
        dos: 'CONMUTACIÓN Y ENRUTAMIENTO DE REDES',
        tres: 'PROGRAMACIÓN ORIENTADA A OBJETOS',
        cuatro: 'INGLÉS IV',
        cinco: 'APLICACIONES WEB ORIENTADAS A SERVICIOS',
        seis: 'ESTADÍA',
        siete: 'FORMULACIÓN DE PROYECTOS DE TECNOLOGÍA',
        ocho: 'PROGRAMACIÓN MÓVIL AVANZADA',
        nueve: 'INTERNET DE LAS COSAS',
        diez: '',
        once: 'ESTADÍA'},

    {uno: 'DESARROLLO HUMANO Y VALORES',
        dos: 'INGLÉS II',
        tres: 'BASES DE DATOS',
        cuatro: 'ESTRUCTURA DE DATOS',
        cinco: 'LIDERAZGO DE EQUIPOS DE ALTO DESEMPEÑO',
        seis: 'ESTADÍA',
        siete: 'INGLÉS VI',
        ocho: 'INFORMÁTICA FORENSE',
        nueve: 'EVALUACIÓN DE PROYECTOS DE TECNOLOGÍA',
        diez: '',
        once: 'ESTADÍA'},

    {uno: 'FUNDAMENTOS MATEMÁTICOS',
        dos: 'HABILIDADES SOCIOEMOCIONALES Y MANEJO DE CONFLICTOS',
        tres: 'PROYECTO INTEGRADOR I',
        cuatro: 'DESARROLLO DE APLICACIONES MÓVILES',
        cinco: 'BASES DE DATOS AVANZADAS',
        seis: 'ESTADÍA',
        siete: 'FUNDAMENTOS DE INTELIGENCIA ARTIFICIAL',
        ocho: 'GESTIÓN DE PROYECTOS DE TECNOLOGÍA',
        nueve: 'CIENCIA DE DATOS',
        diez: '',
        once: 'ESTADÍA'},

    {uno: 'INGLÉS I',
        dos: 'PROGRAMACIÓN ESTRUCTURADA',
        tres: 'DESARROLLO DEL PENSAMIENTO Y TOMA DE DECISIONES',
        cuatro: 'CÁLCULO DE VARIAS VARIABLES',
        cinco: 'PROYECTO INTEGRADOR II',
        seis: 'ESTADÍA',
        siete: 'ÉTICA Y LEGISLACIÓN EN TECNOLOGÍAS DE LA INFORMACIÓN',
        ocho: 'ELECTRÓNICA DIGITAL',
        nueve: 'PROYECTO INTEGRADOR III',
        diez: '',
        once: 'ESTADÍA'},

    {uno: 'COMUNICACIÓN Y HABILIDADES DIGITALES',
        dos: 'PROBABILIDAD Y ESTADÍSTICA',
        tres: 'INGLÉS III',
        cuatro: 'APLICACIONES WEB',
        cinco: 'ECUACIONES DIFERENCIALES',
        seis: 'ESTADÍA',
        siete: 'SEGURIDAD INFORMÁTICA',
        ocho: 'PROGRAMACIÓN PARA INTELIGENCIA ARTIFICIAL',
        nueve: 'FRAMEWORKS PARA EL DESARROLLO MULTIPLATAFORMA',
        diez: '',
        once: 'ESTADÍA'},

    {uno: 'FÍSICA',
        dos: 'CÁLCULO DIFERENCIAL',
        tres: 'CÁLCULO INTEGRAL',
        cuatro: 'ANÁLISIS Y DISEÑO DE SOFTWARE',
        cinco: 'ESTÁNDARES Y MÉTRICAS PARA EL DESARROLLO DE SOFTWARE',
        seis: 'ESTADÍA',
        siete: 'BASES DE DATOS EN LA NUBE',
        ocho: 'INGLÉS VII',
        nueve: 'INGLÉS VIII',
        diez: '',
        once: 'ESTADÍA'},

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
