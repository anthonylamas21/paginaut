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
  selector: 'app-carrera-procesos-alimentario',
  templateUrl: './carrera-procesos-alimentario.component.html',
  styleUrl: './carrera-procesos-alimentario.component.css'
})
export class CarreraProcesosAlimentarioComponent {
  currentTab: string = 'segment-1'; // Define el tab inicial
  isLoading = true;
  imagenAmpliada: string | null = null;
  selectedImage: Image = { url: '', alt: '' };

  constructor(private renderer: Renderer2) {}

  images: Image[] = [
    { url: './assets/img/galeria/procesos_alimenticios/proces1.webp', alt: 'Image 1' },
    { url: './assets/img/galeria/procesos_alimenticios/proces2.webp', alt: 'Image 1' },
    { url: './assets/img/galeria/procesos_alimenticios/proces3.webp', alt: 'Image 1' },
    { url: './assets/img/galeria/procesos_alimenticios/proces4.webp', alt: 'Image 1' },
    { url: './assets/img/galeria/procesos_alimenticios/proces5.webp', alt: 'Image 1' },
    { url: './assets/img/galeria/procesos_alimenticios/proces6.webp', alt: 'Image 1' },
    { url: './assets/img/galeria/procesos_alimenticios/proces7.webp', alt: 'Image 1' },
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
      nabvar.classList.add('bg-primary-color');
    }
  }

  scrollToSection(sectionId: string): void {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  }

  @ViewChild('dt') dt: Table | undefined;

  items: Item[] = [

    {uno: 'BIOLOGÍA', dos: 'CÁLCULO DIFERENCIAL', tres: 'CÁLCULO INTEGRAL', cuatro: 'ANÁLISIS DE ALIMENTOS', cinco: 'ADMINISTRACIÓN DE LA PRODUCCIÓN', seis: 'Estadia', siete: 'BALANCE DE MATERIA Y ENERGÍA', ocho: '', nueve: 'BIOINGENIERÍA', diez: 'Estadia'},

    {uno: 'COMUNICACIÓN Y HABILIDADES DIGITALES', dos: 'FÍSICA', tres: 'DESARROLLO DEL PENSAMIENTO Y TOMA DE DECISIONES', cuatro: 'CÁLCULO DE VARIAS VARIABLES', cinco: 'ECUACIONES DIFERENCIALES', seis: 'Estadia', siete: 'BIOQUÍMICA', ocho: '', nueve: 'CONSULTORÍA Y CAPACITACIÓN A EMPRESAS', diez: 'Estadia'},

    {uno: 'DESARROLLO HUMANO Y VALORES', dos: 'HABILIDADES SOCIOEMOCIONALES Y MANEJO DE CONFLICTOS', tres: 'INGLÉS III', cuatro: 'ÉTICA PROFESIONAL', cinco: 'INGLÉS V', seis: 'Estadia', siete: 'DISEÑO DE EXPERIMENTOS', ocho: '', nueve: 'DISEÑO DE PLANTAS', diez: 'Estadia'},

    {uno: 'FUNDAMENTOS MATEMÁTICOS', dos: 'INGLÉS II', tres: 'PROYECTO INTEGRADOR I', cuatro: 'INGLÉS IV', cinco: 'LIDERAZGO DE EQUIPOS DE ALTO DESEMPEÑO', seis: 'Estadia', siete: 'HABILIDADES GERENCIALES', ocho: '', nueve: 'DISEÑO DE PROCESOS', diez: 'Estadia'},

    {uno: 'INGLÉS I', dos: 'MICROBIOLOGIA', tres: 'QUÍMICA DE ALIMENTOS', cuatro: 'INOCUIDAD ALIMENTARIA ALIMENTOS', cinco: 'PROYECTO INTEGRADOR II', seis: 'Estadia', siete: 'INGLÉS VI', ocho: '', nueve: 'INGLÉS VIII', diez: 'Estadia'},

    {uno: 'METODOLOGÍA DE LA INVESTIGACIÓN', dos: 'PROBABILIDAD Y ESTADÍSTICA', tres: 'QUÍMICA DE ALIMENTOS', cuatro: 'MICROBIOLOGÍA DE ALIMENTOS', cinco: 'SISTEMAS DE CALIDAD', seis: 'Estadia', siete: 'OPERACIONES UNITARIAS I', ocho: '', nueve: 'OPERACIONES UNITARIAS III', diez: 'Estadia'},

    {uno: 'QUÍMICA GENERAL', dos: 'QUÍMICA ANÁLITICA', tres: 'TECNOLOGÍAS DE CONSERVACIÓN DE ALIMENTOS', cuatro: 'TECNOLOGÍA DE ALIMENTOS II', cinco: 'TECNOLOGÍA DE ALIMENTOS III', seis: 'Estadia', siete: 'TERMODINÁMICA', ocho: '', nueve: 'PROYECTO INTEGRADOR III', diez: 'Estadia'},

    {uno: '', dos: '', tres: '', cuatro: '', cinco: '', seis: 'Estadia', siete: '', ocho: '', nueve: '', diez: ''},

    {uno: '', dos: '', tres: '', cuatro: '', cinco: '', seis: 'Estadia', siete: '', ocho: '', nueve: '', diez: ''},

    {uno: '', dos: '', tres: '', cuatro: '', cinco: '', seis: 'Estadia', siete: '', ocho: '', nueve: '', diez: ''},

];

//INICIO TABLA CUATRIMESTRES
onMouseOver(columna: string, valor: any) {
  if(valor == ""){
    // console.log(`El elemento de la columna ${columna} con valor "NULO" fue seleccionado`);
  }else{
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
