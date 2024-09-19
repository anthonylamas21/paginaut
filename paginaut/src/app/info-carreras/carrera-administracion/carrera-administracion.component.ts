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
  selector: 'app-carrera-administracion',
  templateUrl: './carrera-administracion.component.html',
  styleUrl: './carrera-administracion.component.css'
})
export class CarreraAdministracionComponent {
  currentTab: string = 'segment-1'; // Define el tab inicial
  isLoading = true;
  imagenAmpliada: string | null = null;
  selectedImage: Image = { url: '', alt: '' };

  constructor(private renderer: Renderer2) {}

  images: Image[] = [
    { url: './assets/img/galeria/admin/admin1.jpg', alt: 'Image 1' },
    { url: './assets/img/galeria/admin/admin2.jpg', alt: 'Image 2' },
    { url: './assets/img/galeria/admin/admin3.jpg', alt: 'Image 3' },
    { url: './assets/img/galeria/admin/admin4.jpg', alt: 'Image 4' },
    { url: './assets/img/galeria/admin/admin5.jpg', alt: 'Image 5' },
    { url: './assets/img/galeria/admin/admin6.jpg', alt: 'Image 6' },
    { url: './assets/img/galeria/admin/admin7.jpg', alt: 'Image 7' },
    { url: './assets/img/galeria/admin/admin8.jpg', alt: 'Image 8' },
    { url: './assets/img/galeria/admin/admin9.jpg', alt: 'Image 9' },
    { url: './assets/img/galeria/admin/admin10.jpg', alt: 'Image 10' },
    { url: './assets/img/galeria/admin/admin11.jpg', alt: 'Image 11' },
    { url: './assets/img/galeria/admin/admin12.jpg', alt: 'Image 12' },
    { url: './assets/img/galeria/admin/admin13.jpg', alt: 'Image 13' },
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
      nabvar.classList.add('bg-[#043D3D]');
    }
  }

  scrollToSection(sectionId: string): void {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  }

  @ViewChild('dt') dt: Table | undefined;

  items: Item[] = [
    {uno: 'Informática', dos: 'Matemáticas financieras', tres: 'Planeación estratégica', cuatro: 'Comportamiento organizacional', cinco: 'Comportamiento organizacional II', seis: 'Estadia', siete: 'Sociología Del Trabajo', ocho: 'Capacitación Del Capital Humano', nueve: 'Sistema De Gestión De La Calidad', diez: 'Auditoría De Calidad', once: 'Estadia'},

    {uno: 'Matemáticas', dos: 'Estadística aplicada a la Administración', tres: 'Talento emprendedor', cuatro: 'Diseño y valuación de puestos', cinco: 'Desarrollo de capital humano', seis: 'Estadia', siete: 'Pedagogía Empresarial', ocho: 'Cultura Corporativa', nueve: 'Herramientas De Gestión Del Personal', diez: 'Consultoría En Capital Humano', once: 'Estadia'},

    {uno: 'Administración de organizaciones', dos: 'Modelos de desarrollo organizacional', tres: 'Análisis e interpretación de estados financieros', cuatro: 'Sueldos y salarios I', cinco: 'Evaluación del desempeño', seis: 'Estadia', siete: 'Administración De Proyectos De Capital Humano', ocho: 'Inteligencia Emocional', nueve: 'Gestión Del Cambio Organizacional', diez: 'Responsabilidad Social Aplicada', once: 'Estadia'},

    {uno: 'Mercadotecnia', dos: 'Metodología de la investigación', tres: 'Planeación financiera', cuatro: 'Previsión y seguridad social', cinco: 'Higiene y seguridad laboral', seis: 'Estadia', siete: 'Investigación Cualitativa', ocho: 'Inglés VII', nueve: 'Inglés VIII', diez: 'Integradora I', once: 'Estadia'},

    {uno: 'Contabilidad básica', dos: 'Contabilidad intermedia', tres: 'Desarrollo sustentable', cuatro: 'Integración de capital humano', cinco: 'Integradora II', seis: 'Estadia', siete: 'Inglés VI', ocho: 'Planeación Y Organización Para El Trabajo', nueve: 'Dirección De Equipos De Alto Rendimiento', diez: 'Inglés IX', once: 'Estadia'},

    {uno: 'Inglés I', dos: 'Fundamentos de economía', tres: 'Legislación organizacional', cuatro: 'Legislación laboral', cinco: 'Inglés V', seis: 'Estadia', siete: 'Administración Del Tiempo', ocho: '', nueve: '', diez: 'Negociación Empresarial', once: 'Estadia'},

    {uno: 'Expresión oral y escrita I', dos: 'Inglés II', tres: 'Integradora I', cuatro: 'Inglés IV', cinco: 'Expresión oral y escrita II', seis: 'Estadia', siete: '', ocho: '', nueve: '', diez: '', once: 'Estadia'},

    {uno: 'Formación sociocultural I', dos: 'Formación sociocultura II', tres: 'Inglés III', cuatro: 'Formación sociocultural IV', cinco: '', seis: 'Estadia', siete: '', ocho: '', nueve: '', diez: '', once: 'Estadia'},

    {uno: '', dos: '', tres: 'Formación sociocultural III', cuatro: '', cinco: '', seis: 'Estadia', siete: '', ocho: '', nueve: '', diez: '', once: 'Estadia'}
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
