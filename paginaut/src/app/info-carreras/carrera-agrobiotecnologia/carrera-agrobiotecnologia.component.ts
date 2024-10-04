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
  selector: 'app-carrera-agrobiotecnologia',
  templateUrl: './carrera-agrobiotecnologia.component.html',
  styleUrl: './carrera-agrobiotecnologia.component.css'
})
export class CarreraAgrobiotecnologiaComponent {
  currentTab: string = 'segment-1'; // Define el tab inicial

  isLoading = true;
  imagenAmpliada: string | null = null;
  selectedImage: Image = { url: '', alt: '' };

  constructor(private renderer: Renderer2) {}

  images: Image[] = [
    { url: './assets/img/galeria/agro/AGRO_1.jpeg', alt: '' },
    { url: './assets/img/galeria/agro/AGRO_2.jpeg', alt: '' },
    { url: './assets/img/galeria/agro/AGRO_3.jpeg', alt: '' },
    { url: './assets/img/galeria/agro/AGRO_4.jpeg', alt: '' },
    { url: './assets/img/galeria/agro/AGRO_5.jpeg', alt: '' },
    { url: './assets/img/galeria/agro/AGRO_6.jpeg', alt: '' },
    { url: './assets/img/galeria/agro/AGRO_7.jpeg', alt: '' },
    { url: './assets/img/galeria/agro/AGRO_8.jpeg', alt: '' },
    { url: './assets/img/galeria/agro/AGRO_9.jpeg', alt: '' },
    { url: './assets/img/galeria/agro/AGRO_10.jpeg', alt: '' },
    { url: './assets/img/galeria/agro/AGRO_11.jpeg', alt: '' },
    { url: './assets/img/galeria/agro/AGRO_12.jpeg', alt: '' },
    { url: './assets/img/galeria/agro/AGRO_13.jpeg', alt: '' },
    { url: './assets/img/galeria/agro/AGRO_14.jpeg', alt: '' },
    { url: './assets/img/galeria/agro/AGRO_15.jpeg', alt: '' },
    { url: './assets/img/galeria/agro/AGRO_16.jpeg', alt: '' },
    { url: './assets/img/galeria/agro/AGRO_17.jpeg', alt: '' },
    { url: './assets/img/galeria/agro/AGRO_18.jpeg', alt: '' },
    { url: './assets/img/galeria/agro/AGRO_19.jpg', alt: '' },
    { url: './assets/img/galeria/agro/AGRO_20.jpeg', alt: '' },
    { url: './assets/img/galeria/agro/AGRO_21.png', alt: '' },
    { url: './assets/img/galeria/agro/AGRO_22.jpg', alt: '' },
    { url: './assets/img/galeria/agro/AGRO_23.jpg', alt: '' },
    { url: './assets/img/galeria/agro/AGRO_24.jpeg', alt: '' },
    { url: './assets/img/galeria/agro/AGRO_25.jpeg', alt: '' },
    { url: './assets/img/galeria/agro/AGRO_26.jpeg', alt: '' },
    { url: './assets/img/galeria/agro/AGRO_27.jpeg', alt: '' },
    { url: './assets/img/galeria/agro/AGRO_28.jpeg', alt: '' },
    { url: './assets/img/galeria/agro/AGRO_29.jpeg', alt: '' },
    
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
    {uno: 'QUÍMICA AGRÍCOLA',  dos: 'PROBABILIDAD Y ESTADÍSTICA',  tres: 'PROYECTO INTEGRADOR I',  cuatro: 'METODOLOGÍA DE LA INVESTIGACIÓN',  cinco: 'PROYECTO INTEGRADOR II',  seis: 'Estadia',  siete: 'SISTEMAS DE INFORMACIÓN GEOGRÁFICA',  ocho: 'SISTEMAS DE PRODUCCIÓN AGRÍCOLA',  nueve: 'PROYECTO INTEGRADOR III',  diez: 'ESTADIA'},

    {uno: 'INGLÉS I',  dos: 'MICROBIOLOGÍA AGRÍCOLA',  tres: 'INGLÉS III',  cuatro: 'INGLÉS IV',  cinco: 'MANEJO INTEGRADO DE PLAGAS, ENFERMEDADES Y ARVENSES',  seis: 'Estadia',  siete: 'NUTRICIÓN VEGETAL',  ocho: 'INGLÉS VII',  nueve: 'INOCUIDAD Y CALIDAD AGRÍCOLA',  diez: 'ESTADIA'},

    {uno: 'FUNDAMENTOS MATEMÁTICOS',  dos: 'INGLÉS II',  tres: 'ENTOMOLOGÍA AGRÍCOLA',  cuatro: 'FITOPATOLOGÍA',  cinco: 'LIDERAZGO DE EQUIPOS DE ALTO DESEMPEÑO',  seis: 'Estadia',  siete: 'INVENTARIO DE RECURSOS NATURALES',  ocho: 'INGENIERÍA ECONÓMICA',  nueve: 'INGLÉS VIII',  diez: 'ESTADIA'},

    {uno: 'DESARROLLO HUMANO Y VALORES',  dos: 'HABILIDADES SOCIOEMOCIONALES Y MANEJO DE CONFLICTOS',  tres: 'EDAFOLOGÍA',  cuatro: 'EXTRACCIÓN DE METABOLITOS',  cinco: 'INGLÉS V',  seis: 'Estadia',  siete: 'INGLÉS VI',  ocho: 'EXTENSIONISMO',  nueve: 'INGENIERÍA GENÉTICA',  diez: 'ESTADIA'},

    {uno: 'COMUNICACIÓN Y HABILIDADES DIGITALES',  dos: 'FISIOLOGÍA VEGETAL',  tres: 'DESARROLLO DEL PENSAMIENTO Y TOMA DE DECISIONES',  cuatro: 'ÉTICA PROFESIONAL',  cinco: 'ECUACIONES DIFERENCIALES',  seis: 'Estadia',  siete: 'HABILIDADES GERENCIALES',  ocho: 'BIORREMEDIACIÓN',  nueve: 'INDUSTRIALIZACIÓN DE PRODUCTOS AGROBIOTECNOLÓGICOS',  diez: 'ESTADIA'},

    {uno: 'BIOLOGÍA AGRÍCOLA',  dos: 'FÍSICA',  tres: 'CÁLCULO INTEGRAL',  cuatro: 'CONTROL BIOLÓGICO',  cinco: 'BIOTECNOLOGÍA VEGETAL',  seis: 'Estadia',  siete: 'DISEÑOS EXPERIMENTALES',  ocho: 'BIOLOGÍA MOLECULAR',  nueve: 'FORMULACIÓN Y EVALUACIÓN DE PROYECTOS',  diez: 'ESTADIA'},

    {uno: 'AGROECOLOGÍA',  dos: 'CÁLCULO DIFERENCIAL',  tres: 'AGROCLIMATOLOGÍA',  cuatro: 'CÁLCULO DE VARIAS VARIABLES',  cinco: 'BIOFERTILIZANTES',  seis: 'Estadia',  siete: 'BIOINGENIERÍA',  ocho: 'AGRICULTURA ORGÁNICA',  nueve: 'AGRICULTURA PROTEGIDA',  diez: 'ESTADIA'},

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
