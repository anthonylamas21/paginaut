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
  selector: 'app-carrera-acuicultura',
  templateUrl: './carrera-acuicultura.component.html',
  styleUrl: './carrera-acuicultura.component.css'
})
export class CarreraAcuiculturaComponent {
  currentTab: string = 'segment-1'; // Define el tab inicial

  isLoading = true;
  imagenAmpliada: string | null = null;
  selectedImage: Image = { url: '', alt: '' };

  constructor(private renderer: Renderer2) {}

  images: Image[] = [
    { url: './assets/img/galeria/acui/ACUI_1.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/acui/ACUI_2.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/acui/ACUI_3.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/acui/ACUI_4.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/acui/ACUI_5.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/acui/ACUI_6.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/acui/ACUI_7.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/acui/ACUI_8.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/acui/ACUI_9.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/acui/ACUI_10.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/acui/ACUI_11.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/acui/ACUI_12.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/acui/ACUI_13.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/acui/ACUI_14.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/acui/ACUI_15.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/acui/ACUI_16.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/acui/ACUI_17.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/acui/ACUI_18.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/acui/ACUI_19.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/acui/ACUI_20.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/acui/ACUI_21.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/acui/ACUI_22.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/acui/ACUI_23.jpeg', alt: 'Image 1' },
  ];

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

  ngAfterViewInit(): void {
    this.renderer.listen('window', 'load', () => {
        this.isLoading = false
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
    {uno: 'COMUNICACIÓN Y HABILIDADES DIGITALES', dos: 'CÁLCULO DIFERENCIAL', tres: 'BUENAS PRÁCTICAS ACUÍCOLAS E INOCUIDAD', cuatro: 'CÁLCULO DE VARIAS VARIABLES', cinco: 'CONTABILIDAD Y EVALUACIÓN FINANCIERA', seis: 'ESTADIA', siete: 'FÍSICA APLICADA A LA ACUICULTURA', ocho: 'COMERCIALIZACIÓN DE LA PRODUCCIÓN ACUÍCOLA', nueve: 'BIOLOGÍA MOLECULAR Y GENÉTICA', diez: 'ESTADIA'},

    {uno: 'DESARROLLO HUMANO Y VALORES', dos: 'CULTIVOS AUXILIARES', tres: 'CÁLCULO INTEGRAL', cuatro: 'CALIDAD Y MANEJO DEL AGUA', cinco: 'CULTIVO DE CRUSTÁCEOS', seis: 'ESTADIA', siete: 'HABILIDADES GERENCIALES', ocho: 'CULTIVOS ALTERNATIVOS', nueve: 'DISEÑO EXPERIMENTAL Y MÉTODOS ESTADÍSTICOS', diez: 'ESTADIA'},
    
    {uno: 'FUNDAMENTOS DE ACUICULTURA', dos: 'FÍSICA', tres: 'CULTIVO DE PECES', cuatro: 'CULTIVO DE MOLUSCOS', cinco: 'ECUACIONES DIFERENCIALES', seis: 'ESTADIA', siete: 'INGLÉS VI', ocho: 'DIBUJO TÉCNICO DE INFRAESTRUCTURA ACUÍCOLA CON SOFTWARE', nueve: 'EVALUACIÓN SOCIOECONÓMICA', diez: 'ESTADIA'},
    
    {uno: 'FUNDAMENTOS DE BIOLOGÍA ACUÁTICA', dos: 'HABILIDADES SOCIOEMOCIONALES Y MANEJO DE CONFLICTOS', tres: 'DESARROLLO DEL PENSAMIENTO Y TOMA DE DECISIONES', cuatro: 'ECOLOGÍA DE LOS AMBIENTES ACUÁTICOS', cinco: 'INGLÉS V', seis: 'ESTADIA', siete: 'MORFOFISIOLOGÍA DE LOS ORGANISMOS ACUÍCOLAS', ocho: 'INGLÉS VII', nueve: 'EXTENSIONISMO DE LA ACUICULTURA', diez: 'ESTADIA'},
    
    {uno: 'FUNDAMENTOS MATEMÁTICOS', dos: 'QUÍMICA ORGÁNICA', tres: 'INGLÉS III', cuatro: 'ÉTICA PROFESIONAL', cinco: 'LIDERAZGO DE EQUIPOS DE ALTO DESEMPEÑO', seis: 'ESTADIA', siete: 'QUÍMICA APLICADA AL MANEJO DEL AGUA', ocho: 'MANEJO DE LA PRODUCCIÓN ACUÍCOLA', nueve: 'INGLÉS VIII', diez: 'ESTADIA'},
    
    {uno: 'INGLÉS I', dos: 'SISTEMAS ACUÍCOLAS', tres: 'PROBABILIDAD Y ESTADÍSTICA', cuatro: 'INGLÉS IV', cinco: 'PROYECTO INTEGRADOR II', seis: '', siete: 'SISTEMAS DE RECIRCULACIÓN Y TRATAMIENTO DE AGUA', ocho: 'NUTRICIÓN DE LOS ORGANISMOS ACUÍCOLAS', nueve: 'NEGOCIACIÓN EMPRESARIAL', diez: ''},
    
    {uno: 'QUÍMICA GENERAL', dos: 'INGLÉS II', tres: 'PROYECTO INTEGRADOR I', cuatro: 'SANIDAD ACUÍCOLA I', cinco: 'SIG Y EVALUACIÓN DEL ENTORNO', seis: '', siete: 'TECNOLOGÍAS Y METODOLOGÍAS ACUÍCOLAS', ocho: 'SANIDAD ACUÍCOLA II', nueve: 'PROYECTO INTEGRADOR III', diez: 'ESTADIA'},
    
    {uno: '', dos: '', tres: '', cuatro: '', cinco: '', seis: '', siete: '', ocho: '', nueve: '', diez: ''}
    
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
