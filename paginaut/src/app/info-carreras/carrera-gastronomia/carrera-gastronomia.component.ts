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
  isLoading = true;
  
  constructor(private renderer: Renderer2) {}

  images: Image[] = [
    { url: './assets/img/galeria/mg2.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/mg2.jpg', alt: 'Image 2' },
    // más imágenes aquí
  ];

  selectedImage: Image = { url: '', alt: '' };

  openModal(image: Image): void {
    if (image) {
      this.selectedImage = image;
      const modal = document.getElementById('hs-vertically-centered-modal');
      if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('pointer-events-auto');
      }
    }
  }
  
  ngAfterViewInit(): void {
    this.renderer.listen('window', 'load', () => {
      setInterval(() => {
        this.isLoading = false
      }, 3000);  
      
    });
  }
  ngOnInit(): void {
    this.setNavbarColor();
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
    console.log(`El elemento de la columna ${columna} con valor "NULO" fue seleccionado`);
  }else{
    console.log(`El elemento de la columna ${columna} con valor "${valor}" fue seleccionado`);
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
