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
  selector: 'app-carrera-mercadotecnia',
  templateUrl: './carrera-mercadotecnia.component.html',
  styleUrl: './carrera-mercadotecnia.component.css'
})
export class CarreraMercadotecniaComponent {
  isLoading = true;
  
  constructor(private renderer: Renderer2) {}

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
    {uno: 'Matemáticas', dos: 'Estadística', tres: 'Calidad', cuatro: 'Diseño gráfico', cinco: 'Mercadotecnia internacional', seis: 'Estadia', siete: 'Estadística Aplicada A Los Negocios', ocho: 'Tendencias del mercado y consumidor global', nueve: 'Comunicación Integral De Mercadotecnia', diez: 'Comunicación Ejecutiva', once: 'Estadia'},

    {uno: 'Administración', dos: 'Informática II', tres: 'Gestión de proyectos', cuatro: 'Logística y distribución', cinco: 'Mezcla promocional II', seis: 'Estadia', siete: 'Desarrollo De Nuevos Productos', ocho: 'Administración De La Producción', nueve: 'Planeación Y Seguimiento De Proyectos', diez: 'Cadena De Suministros', once: 'Estadia'},

    {uno: 'Informática I', dos: 'Contabilidad', tres: 'Legislación comercial', cuatro: 'Comportamiento del consumidor', cinco: 'Mercadotecnia digital', seis: 'Estadia', siete: 'Inteligencia De Mercados', ocho: 'Gestión Del Talento Humano', nueve: 'Finanzas', diez: 'Plan De Negocios', once: 'Estadia'},

    {uno: 'Mercadotecnia', dos: 'Planeación estratégica', tres: 'Investigación de mercados II', cuatro: 'Estrategias de precios', cinco: 'Mercadotecnia estratégica', seis: 'Estadia', siete: 'Inglés VI', ocho: 'Optativa I', nueve: 'Optativa II', diez: 'Integradora', once: 'Estadia'},

    {uno: 'Economía', dos: 'Investigación de mercados I', tres: 'Integradora I', cuatro: 'Mezcal promocional I', cinco: 'Integradora II', seis: 'Estadia', siete: 'Administración Del Tiempo', ocho: 'Inglés VII', nueve: 'Inglés VIII', diez: 'Inglés IX', once: 'Estadia'},

    {uno: 'Inglés I', dos: 'Ventas', tres: 'Estrategias de productos', cuatro: 'Metodología de la investigación', cinco: 'Inglés V', seis: 'Estadia', siete: '', ocho: 'Planeación y organización del trabajo', nueve: 'Dirección De Equipos De Alto Rendimiento', diez: 'Negociación Empresarial', once: 'Estadia'},

    {uno: 'Expresión oral y escrita I', dos: 'Inglés II', tres: 'Inglés III', cuatro: 'Inglés IV', cinco: 'Expresión oral y escrita II', seis: 'Estadia', siete: '', ocho: '', nueve: '', diez: '', once: 'Estadia'},

    {uno: 'Formación sociocultural I', dos: 'Formación sociocultural II', tres: 'Formación sociocultural III', cuatro: 'Formación sociocultural IV', cinco: '', seis: 'Estadia', siete: '', ocho: '', nueve: '', diez: '', once: 'Estadia'}
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
