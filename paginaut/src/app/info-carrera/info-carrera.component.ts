import { Component, HostListener, ViewChild, Renderer2 } from '@angular/core';
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

@Component({
  selector: 'app-info-carrera',
  templateUrl: './info-carrera.component.html',
  styleUrl: './info-carrera.component.css'
})
export class InfoCarreraComponent {

  isLoading = true;

constructor(private renderer: Renderer2){}

  ngOnInit(): void {
    this.setNavbarColor();
  }

  ngAfterViewInit(): void {
    this.renderer.listen('window', 'load', () => {
      setTimeout(() => {
        this.isLoading = false;
      }, 5000);           
    });
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
    {uno: 'Algebra lineal',  dos: 'Funciones matemáticas',  tres: 'Calculo diferencial',  cuatro: 'Estandares y metricas para el desarrollo de software',  cinco: 'Aplicaciones de IoT',  seis: 'Estadia',  siete: 'Matematicas para ingenieria I',  ocho: 'Matemáticas para ingenieria II',  nueve: 'Administracion de proyectos de TI',  diez: 'Gestion del proceso de desarrollo de software',  once: 'Estadia'},
    {uno: 'Desarrollo de habilidades del pensamiento lógico',  dos: 'Metodologías y modelado de desarrollo de software',  tres: 'Probabilidad y estadística',  cuatro: 'Principios de IoT',  cinco: 'Desarrollo móvil multiplataforma',  seis: 'Estadia',  siete: 'Metodologías para el desarrollo de proyectos',  ocho: 'Administración de bases de datos',  nueve: 'Extracción de conocimiento en bases de datos',  diez: 'Aplicaciones WEB progresivas',  once: 'Estadia'},
    {uno: 'Fundamentos de TI',  dos: 'Interconexión de redes',  tres: 'Sistemas Operativos',  cuatro: 'Diseño de Apps',  cinco: 'Integradora II',  seis: 'Estadia',  siete: 'Arquitecturas de software',  ocho: 'Desarrollo Web profesional',  nueve: 'Desarrollo WEB Integral',  diez: 'Integradora',  once: 'Estadia'},
    {uno: 'Fundamentos de redes',  dos: 'Programación Orientada a Objetos',  tres: 'Integradora I',  cuatro: 'Estructuras de datos Aplicadas',  cinco: 'Aplicaciones Web para I4.0',  seis: 'Estadia',  siete: 'Experiencia de usuario',  ocho: 'Seguridad en el desarrollo de aplicaciones',  nueve: 'Desarrollo para dispositivos inteligentes',  diez: 'Desarrollo móvil integral',  once: 'Estadia'},
    {uno: 'Metodología de la programación',  dos: 'Introducción al diseño digital',  tres: 'Aplicaciones Web',  cuatro: 'Aplicaciones Web orientadas a servicios',  cinco: 'Bases de datos para cómputo en la nube',  seis: 'Estadia',  siete: 'Seguridad informática',  ocho: 'Inglés VII',  nueve: 'Inglés VIII',  diez: 'Optativa II: Creación de Videojuegos',  once: 'Estadia'},
    {uno: 'Expresión oral y escrita I',  dos: 'Base de datos para aplicaciones',  tres: 'Bases de datos para aplicaciones',  cuatro: 'Evaluación y mejora para el desarrollo de software',  cinco: 'Expresión oral y escrita II',  seis: 'Estadia',  siete: 'Inglés VI',  ocho: 'Planeación y Organización del trabajo',  nueve: 'Dirección de Equipos de Alto Rendimiento',  diez: 'Inglés IX',  once: 'Estadia'},
    {uno: 'Inglés I',  dos: 'Inglés II',  tres: 'Inglés III',  cuatro: 'Inglés IV',  cinco: 'Inglés V',  seis: 'Estadia',  siete: 'Administración del tiempo',  ocho: '',  nueve: '',  diez: 'Negociación empresarial',  once: 'Estadia'},
    {uno: 'Formación Sociocultural I',  dos: 'Formación Sociocultural II',  tres: 'Formación Sociocultural III',  cuatro: 'Formación Sociocultural IV', cinco: '',  seis: 'Estadia',  siete: '',  ocho: '',  nueve: '',  diez: '',  once: 'Estadia'}
];

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
