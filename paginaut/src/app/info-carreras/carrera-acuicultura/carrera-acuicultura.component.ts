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
@Component({
  selector: 'app-carrera-acuicultura',
  templateUrl: './carrera-acuicultura.component.html',
  styleUrl: './carrera-acuicultura.component.css'
})
export class CarreraAcuiculturaComponent {

  isLoading = true;
  
  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    this.setNavbarColor();
  }

  ngAfterViewInit(): void {
    this.renderer.listen('window', 'load', () => {
      setInterval(() => {
        this.isLoading = false
      }, 3000);  
      
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
    {uno: 'Matemáticas', dos: 'Bioestadística', tres: 'Ecología', cuatro: 'Evaluación Del Entorno', cinco: 'Evaluación Socioeconómica', seis: 'Estadia', siete: 'Geometría Analítica', ocho: 'Cálculo diferencial e integral', nueve: 'Métodos estadísticos', diez: 'Diseño e infraestructura Acuícola con software CAD', once: 'Estadia'},

    {uno: 'Informática', dos: 'Introducción A La Ecología', tres: 'Sanidad Acuícola', cuatro: 'Mercadotecnia Para Proyectos Acuícolas', cinco: 'Cultivo De Anfibios Y Reptiles', seis: 'Estadia', siete: 'Química aplicada a la Acuicultura', ocho: 'Física e hidráulica', nueve: 'Fisiología Acuícola', diez: 'Extensionismo Acuícola', once: 'Estadia'},

    {uno: 'Calidad Del Agua', dos: 'Administración', tres: 'Moluscos', cuatro: 'Cultivos Crustáceos', cinco: 'Cultivo De Peces', seis: 'Estadia', siete: 'Manejo de calidad del agua', ocho: 'Genética de la reproducción acuícola', nueve: 'Producción Acuícola', diez: 'Nutrición y Alimentación acuícola II', once: 'Estadia'},

    {uno: 'Sistemas Acuícolas', dos: 'Inocuidad Acuícola', tres: 'Metodología De La Investigación', cuatro: 'Contabilidad', cinco: 'Evaluación Financiera', seis: 'Estadia', siete: 'Tecnología Acuícolas I', ocho: 'Tecnologías Acuícolas II', nueve: 'Nutrición y Alimentación Acuícola I', diez: 'Integradora', once: 'Estadia'},

    {uno: 'Inglés I', dos: 'Cultivos De Organismos Auxiliares', tres: 'Inglés III', cuatro: 'Inglés IV', cinco: 'Integradora II', seis: 'Estadia', siete: 'Inglés VI', ocho: 'Inglés VII', nueve: 'Inglés VIII', diez: 'Inglés IX', once: 'Estadia'},

    {uno: 'Expresión Oral Y Escrita I', dos: 'Integradora I', tres: 'Formación Sociocultural III', cuatro: 'Formación Sociocultural IV', cinco: 'Expresión Oral Y Escrita II', seis: 'Estadia', siete: 'Administración del tiempo', ocho: 'Planeación y Organización del trabajo', nueve: 'Dirección de equipos de alto rendimiento', diez: 'Negociación empresarial', once: 'Estadia'},

    {uno: 'Formación Sociocultural I', dos: 'Inglés II', tres: '', cuatro: '', cinco: 'Expresión', seis: 'Estadia', siete: '', ocho: '', nueve: '', diez: '', once: 'Estadia'},

    {uno: '',  dos: 'Formación Sociocultural II',  tres: '',  cuatro: '', cinco: '',  seis: 'Estadia',  siete: '',  ocho: '',  nueve: '',  diez: '',  once: 'Estadia'}
    ];

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
