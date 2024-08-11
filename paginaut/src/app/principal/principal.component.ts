import { Component, HostListener, OnInit, AfterViewInit , ElementRef, ViewChild } from '@angular/core';
import { EventoService, Evento } from '../evento.service';
import { NoticiaService, Noticia } from '../noticia.service';
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit, AfterViewInit{

  @ViewChild('carrerasSection') carrerasSection!: ElementRef;
  @ViewChild('becasSection') becasSection!: ElementRef;
  @ViewChild('eventosSection') eventosSection!: ElementRef;
  @ViewChild('noticiasSection') noticiasSection!: ElementRef;
  @ViewChild('recorridoSection') recorridoSection!: ElementRef;
  @ViewChild('logosUl') logosUl!: ElementRef;
  
  private secretKey = 'X9f2Kp7Lm3Qr8Zw5Yt6Vb1Nj4Hg'; // Usa una clave segura en producción
  eventosRecientes: Evento[] = [];
  noticias: Noticia[] = [];
  noticiasVisibles: Noticia[] = [];
  cantidadInicial = 3;
  incremento = 3;

  encryptedToken: string | null;
  encryptedRol: string | null;
  encryptedDepa: string | null;

  sliceValue: number = 20;  // Default to small screen
  minsliceValue: number = 50;

  getDynamicSliceValue(text: string): number {
    return Math.min(text.length, this.minsliceValue);
  }

  imagenes = [
    { src: './assets/img/fotos_por_carrera/desarrollo-software.jpg', alt: 'Desarrollo de Software' },
    { src: './assets/img/fotos_por_carrera/contaduria.jpg', alt: 'Contaduría' },
    { src: './assets/img/fotos_por_carrera/gastronomia.jpg', alt: 'Gastronomía' },
    { src: './assets/img/fotos_por_carrera/administracion.jpg', alt: 'Administración' },
    { src: './assets/img/fotos_por_carrera/mercadotecnia.jpg', alt: 'Mercadotecnia' },
    { src: './assets/img/fotos_por_carrera/turismo.jpg', alt: 'Turismo' },
    { src: './assets/img/fotos_por_carrera/acuicultura.jpg', alt: 'Acuicultura' },
    { src: './assets/img/fotos_por_carrera/procesos-alimenticios.jpg', alt: 'Procesos Alimenticios' },
    { src: './assets/img/fotos_por_carrera/agrobiotecnologia.jpg', alt: 'Agrobiotecnología' },
  ];

  constructor(
    private eventoService: EventoService,
    private noticiaService: NoticiaService,
    private router: Router
  ) {

    this.encryptedToken = localStorage.getItem('token');
    this.encryptedRol = localStorage.getItem('rol');
    this.encryptedDepa = localStorage.getItem('depa');

    this.setSliceValue(window.innerWidth);
  }

  private decrypt(encrypted: string): string {
    return CryptoJS.AES.decrypt(encrypted, this.secretKey).toString(CryptoJS.enc.Utf8);
  }

  ngOnInit() {
    this.cargarEventosRecientes();
    this.cargarNoticias();
  }

  scrollToSectionCarreras(sectionId: string): void {
    this.router.navigate([], { fragment: sectionId }).then(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  preloadImages() {
    this.imagenes.forEach(image => {
      const img = new Image();
      img.src = image.src;
      img.onload = () => {
        console.log(`Imagen ${image.alt} cargada.`);
      };
    });
  }

  cargarEventosRecientes(): void {
    this.eventoService.obtenerEventosRecientes().subscribe({
      next: (eventos) => {
        this.eventosRecientes = eventos.map(evento => ({
          ...evento,
          imagen_principal: this.getImageUrl(evento.imagen_principal || ''),
          imagenes_generales: (evento.imagenes_generales || []).map((img: string) => this.getImageUrl(img))
        }));
        console.log(this.eventosRecientes)
      },
      error: (error) => console.error('Error al cargar eventos recientes:', error)
    });
  }

  cargarNoticiasActivas(): void {
    this.noticiaService.obtenerNoticiasActivas().subscribe({
      next: (noticias) => {
        this.noticias = noticias.map(noticia => ({
          ...noticia,
          imagen_principal: this.getImageUrl(noticia.imagen_principal || ''),
          imagenes_generales: (noticia.imagenes_generales || []).map((img: string) => this.getImageUrl(img))
        }));
        this.noticiasVisibles = this.noticias.slice(0, this.cantidadInicial);
      },
      error: (error) => console.error('Error al cargar noticias activas:', error)
    });
  }

  getImageUrl(relativePath: string): string {
    const baseImageUrl = 'http://localhost/paginaut/';
    if (relativePath && relativePath.startsWith('../')) {
      return baseImageUrl + relativePath.substring(3);
    }
    return baseImageUrl + relativePath;
  }

  verMasNoticias(): void {
    const nuevaCantidad = this.noticiasVisibles.length + this.incremento;
    this.noticiasVisibles = this.noticias.slice(0, nuevaCantidad);
  }
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const button = document.getElementById('scrollTopButton');
    const nabvar = document.getElementById('navbarAccion');
    const inicioSection = document.getElementById('inicio');

    if (inicioSection && nabvar) {
      const inicioSectionBottom = inicioSection.getBoundingClientRect().bottom;

      if (window.scrollY > inicioSectionBottom) {
        button?.classList.remove('hidden');
        nabvar.classList.remove('bg-transparent', 'transition-colors', 'duration-500');
        nabvar.classList.add('bg-[#043D3D]', 'transition-colors', 'duration-500');
      } else {
        button?.classList.add('hidden');
        nabvar.classList.remove('bg-[#043D3D]', 'transition-colors', 'duration-500');
        nabvar.classList.add('bg-transparent', 'transition-colors', 'duration-500');
      }
    }
  }

  scrollToSection(sectionId: string): void {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  }

  //Inicio de recorte de informacion de noticias
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.setSliceValue(event.target.innerWidth);
  }

  setSliceValue(width: number) {
    this.sliceValue = Math.floor(width / 15); 
    this.sliceValue = Math.min(Math.max(this.sliceValue, 20), 400); 
  }
  //Fin de recorte de informacion de noticias

  //Inicio de las animaciones de las secciones
  ngAfterViewInit() {
    this.setupIntersectionObserver();
    this.preloadImages();
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('opacity-0', 'translate-y-10');
          entry.target.classList.add('opacity-100', 'translate-y-0');
          // Una vez que el elemento es visible, dejamos de observarlo
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });
  
    // Observar los elementos
    [
      this.carrerasSection,
      this.becasSection,
      this.eventosSection,
      this.noticiasSection,
      this.recorridoSection
    ].forEach(section => {
      if (section && section.nativeElement) {
        observer.observe(section.nativeElement);
      }
    });
  }
  //Fin de las animaciones de las secciones
}
