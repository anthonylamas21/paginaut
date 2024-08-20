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
  selector: 'app-carrera-contaduria',
  templateUrl: './carrera-contaduria.component.html',
  styleUrl: './carrera-contaduria.component.css'
})
export class CarreraContaduriaComponent {
  isLoading = true;
  imagenAmpliada: string | null = null;
  selectedImage: Image = { url: '', alt: '' };
  
  constructor(private renderer: Renderer2) {}

  images: Image[] = [
    { url: './assets/img/galeria/contaduria/contaduria1.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/contaduria/contaduria2.jpg', alt: 'Image 2' },
    { url: './assets/img/galeria/contaduria/contaduria3.jpg', alt: 'Image 3' },
    // más imágenes aquí
  ];

  ngAfterViewInit(): void {
    this.renderer.listen('window', 'load', () => {
        this.isLoading = false
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
    {uno: 'Matemáticas', dos: 'Estadística', tres: 'Matemáticas Financieras', cuatro: 'Fundamentos de Auditoría', cinco: 'Auditoría Financiera', seis: 'Estadia', siete: '', ocho: '', nueve: '', diez: '', once: ''},

    {uno: 'Informática I', dos: 'Informática II', tres: 'Contabilidad de Sociedades', cuatro: 'Contabilidad de Costos I', cinco: 'Contabilidad de Costos II', seis: 'Estadia', siete: '', ocho: '', nueve: '', diez: '', once: ''},

    {uno: 'Derecho Civil', dos: 'Derecho Mercantil', tres: 'Contabilidad Superior', cuatro: 'Administración Financiera', cinco: 'Contribuciones de Personas Físicas', seis: 'Estadia', siete: '', ocho: '', nueve: '', diez: '', once: ''},

    {uno: 'Contabilidad Básica', dos: 'Contabilidad Intermedia', tres: 'Introducción al Derecho Fiscal', cuatro: 'Calidad', cinco: 'Sueldos y Salarios', seis: 'Estadia', siete: '', ocho: '', nueve: '', diez: '', once: ''},

    {uno: 'Fundamentos de Administración', dos: 'Derecho Laboral', tres: 'Análisis e Interpretación de Estados Financieros', cuatro: 'Contribuciones de Personas Morales', cinco: 'Integradora II', seis: 'Estadia', siete: '', ocho: '', nueve: '', diez: '', once: ''},

    {uno: 'Inglés I', dos: 'Economía', tres: 'Presupuestos', cuatro: 'Comercio Exterior', cinco: 'Inglés V', seis: 'Estadia', siete: '', ocho: '', nueve: '', diez: '', once: ''},

    {uno: 'Expresión Oral y Escrita I', dos: 'Inglés II', tres: 'Integradora I', cuatro: 'Evaluación Financiera de Proyectos', cinco: 'Expresión Oral y Escrita II', seis: 'Estadia', siete: '', ocho: '', nueve: '', diez: '', once: ''},



    {uno: 'Formación Sociocultural I', dos: 'Formación Sociocultural II', tres: 'Inglés III', cuatro: 'Inglés IV', cinco: '', seis: 'Estadia', siete: '', ocho: '', nueve: '', diez: '', once: ''},

    {uno: '', dos: '', tres: 'Formación Sociocultural III', cuatro: 'Evaluación Financiera de Proyectos', cinco: '', seis: 'Estadia', siete: '', ocho: '', nueve: '', diez: '', once: ''},
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
