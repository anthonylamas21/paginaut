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
    {uno: 'Algebra lineal',  dos: 'Funciones matemáticas',  tres: 'Calculo diferencial',  cuatro: 'Cálculo Integral',  cinco: 'Diseños Experimentales	',  seis: 'Estadia',  siete: 'Matematicas para ingenieria I',  ocho: 'Matemáticas para ingenieria II',  nueve: 'Operaciones Unitarias II',  diez: 'Ingeniería Genética	',  once: 'Estadia'},

    {uno: 'Química Básica',  dos: 'Química Orgánica',  tres: 'Química Analítica',  cuatro: 'Probabilidad Y Estadística',  cinco: 'Biorremediación',  seis: 'Estadia',  siete: 'Termodinámica',  ocho: 'Bioestadística',  nueve: 'Biología Molecular',  diez: 'Ingeniería Económica',  once: 'Estadia'},

    {uno: 'Biología Agrícola',  dos: 'Física',  tres: 'Electricidad Y Magnetismo',  cuatro: 'Agricultura Sostenible',  cinco: 'Extracción De Metabolitos',  seis: 'Estadia',  siete: 'Fisicoquímica',  ocho: 'Operaciones Unitarias I',  nueve: '',  diez: '',  once: 'Estadia'},

    {uno: 'Informática',  dos: 'Microbiología',  tres: 'Genética Vegetal',  cuatro: 'Propagación Vegetativa',  cinco: 'Abonos Orgánicos',  seis: 'Estadia',  siete: 'Metodología De La Investigación',  ocho: 'Administración De La Calidad',  nueve: 'Conservación De Bioproductos',  diez: 'Caracterización De Bioproductos',  once: 'Estadia'},

    {uno: 'Botánica Sistemática',  dos: 'Bioquímica',  tres: 'Agrobiotecnología',  cuatro: 'Integradora I',  cinco: 'Biofertilizantes',  seis: 'Estadia',  siete: 'Administración De La Producción Agrobiotecnológica',  ocho: 'Inglés VII',  nueve: 'Bioingeniería',  diez: 'Integradora',  once: 'Estadia'},

    {uno: 'Fisiología Vegetal',  dos: 'Biotecnología Vegetal',  tres: 'Agrometeorología',  cuatro: 'Ecología Microbiana',  cinco: 'Control Biológico',  seis: 'Estadia',  siete: 'Inglés VI',  ocho: 'Planeación y Organización del trabajo',  nueve: 'Inglés VIII',  diez: 'Inglés IX',  once: 'Estadia'},

    {uno: 'Inglés I',  dos: 'Edafología',  tres: 'Herramientas De Planeación Y Costos',  cuatro: 'Fitopatología',  cinco: 'Integradora II',  seis: 'Estadia',  siete: 'Administración del tiempo',  ocho: '',  nueve: 'Dirección De Equipos De Alto Rendimiento',  diez: 'Negociación Empresarial',  once: 'Estadia'},

    {uno: 'Expresión Oral Y Escrita I',  dos: 'Inglés II',  tres: 'Inglés III',  cuatro: 'Control De Plagas Y Malezas', cinco: 'Inglés V',  seis: 'Estadia',  siete: '',  ocho: '',  nueve: '',  diez: '',  once: 'Estadia'},

    {uno: '',  dos: 'Formación Sociocultural I',  tres: 'Formación Sociocultural II',  cuatro: 'Inglés IV', cinco: 'Expresión Oral Y Escrita II',  seis: 'Estadia',  siete: '',  ocho: '',  nueve: '',  diez: '',  once: 'Estadia'},

    {uno: '',  dos: '',  tres: '',  cuatro: 'Formación Sociocultural III', cinco: 'Formación Sociocultural IV',  seis: 'Estadia',  siete: '',  ocho: '',  nueve: '',  diez: '',  once: 'Estadia'}
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
