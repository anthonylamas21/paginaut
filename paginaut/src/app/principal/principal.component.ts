import { Component, HostListener, OnInit, AfterViewInit , ElementRef, ViewChild } from '@angular/core';
import { EventoService, Evento } from '../evento.service';
import { NoticiaService, Noticia } from '../noticia.service';
import { VistasService } from '../services/vistas.service';
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router';
import Hashids from 'hashids';

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

  private hashids = new Hashids('X9f2Kp7Lm3Qr8Zw5Yt6Vb1Nj4Hg', 16);
  eventosRecientes: Evento[] = [];
  noticias: Noticia[] = [];
  noticiasVisibles: Noticia[] = [];
  eventosVisibles: Evento[] = [];
  cantidadInicial = 3;
  incremento = 3;
  cantidadInicialEvento = 4; // Mostrar los primeros 4 eventos después del principal
  incrementoEvento = 4;

  encryptedToken: string | null;
  encryptedRol: string | null;
  encryptedDepa: string | null;

  sliceValue: number = 20;  // Default to small screen
  minsliceValue: number = 50;

  viewCount: number = 0;
  visitaRegistrada = false;  // Para evitar múltiples ejecuciones

  getDynamicSliceValue(text: string): number {
    return Math.min(text.length, this.minsliceValue);
  }

  imagenes = [
    { src: './assets/img/fotos_por_carrera/contaduria.webp', alt: 'Contaduría' },
    { src: './assets/img/fotos_por_carrera/gastronomia.webp', alt: 'Gastronomía' },
    { src: './assets/img/fotos_por_carrera/administracion.webp', alt: 'Administración' },
    { src: './assets/img/fotos_por_carrera/mercadotecnia.webp', alt: 'Mercadotecnia' },
    { src: './assets/img/fotos_por_carrera/turismo.webp', alt: 'Turismo' },
    { src: './assets/img/fotos_por_carrera/desarrollo-software.webp', alt: 'Desarrollo de Software' },
    { src: './assets/img/fotos_por_carrera/acuicultura.webp', alt: 'Acuicultura' },
    { src: './assets/img/fotos_por_carrera/procesos-alimenticios.webp', alt: 'Procesos Alimenticios' },
    { src: './assets/img/fotos_por_carrera/agrobiotecnologia.webp', alt: 'Agrobiotecnología' }
  ];

  constructor(
    private eventoService: EventoService,
    private noticiaService: NoticiaService,
    private visitasService: VistasService,
    private router: Router
  ) {

    this.encryptedToken = localStorage.getItem('token');
    this.encryptedRol = localStorage.getItem('rol');
    this.encryptedDepa = localStorage.getItem('depa');

    this.setSliceValue(window.innerWidth);
  }

  verNoticia(id: number | undefined): void {
    if (id !== undefined) {
      const encryptedId = this.hashids.encode(id);
      window.location.href = `/noticia/${encryptedId}`;
    } else {
      //console.error('ID de instalación no disponible');
    }
  }

  verEvento(id: number | undefined): void {
    if (id !== undefined) {
      const encryptedId = this.hashids.encode(id);
      window.location.href = `/evento/${encryptedId}`;
    } else {
      //console.error('ID de instalación no disponible');
    }
  }

  ngOnInit() {
    this.cargarEventosRecientes();
    this.cargarNoticiasActivas();
    this.precargarImagenesCriticas();
    this.getViewCount();
    this.iniciarCicloDeVisitas();

    setTimeout(() => {
      if (!this.visitaRegistrada && !this.tokenExistente()) {
        this.limpiarLocalStorage();
        this.RegistrarVisita();
      }
    }, 5000);  // 5000 milisegundos = 5 segundos
  }
  
  todasCargadas = false;
  precargarImagenesCriticas() {
    const promesas = this.imagenes.map((imagen) => this.cargarImagen(imagen.src));

    // Esperamos que todas las imágenes se hayan cargado
    Promise.all(promesas).then(() => {
      this.todasCargadas = true;
    });
  }
  scrollToSectionCarreras(sectionId: string): void {
    this.router.navigate([], { fragment: sectionId }).then(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  cargarImagen(src: string) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = resolve;
      img.onerror = reject;
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

            // Inicializar eventosVisibles con los primeros 4 eventos adicionales
            if (this.eventosRecientes.length > 1) {
                this.eventosVisibles = this.eventosRecientes.slice(1, this.cantidadInicialEvento + 1);
            } else {
                this.eventosVisibles = [];
            }
        },
        error: (error) => console.error(error)
    });
}
verMasEventos(): void {
  const nuevaCantidad = this.eventosVisibles.length + this.incrementoEvento;

  if (nuevaCantidad <= this.eventosRecientes.length - 1) {
      this.eventosVisibles = this.eventosRecientes.slice(1, nuevaCantidad + 1);
  } else {
      this.eventosVisibles = this.eventosRecientes.slice(1, this.eventosRecientes.length);
  }
}

verMenosEventos(): void {
  const nuevaCantidad = this.eventosVisibles.length - this.incrementoEvento;

  if (nuevaCantidad >= this.cantidadInicialEvento) {
      this.eventosVisibles = this.eventosRecientes.slice(1, nuevaCantidad + 1);
  } else {
      this.eventosVisibles = this.eventosRecientes.slice(1, this.cantidadInicialEvento + 1);
  }
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
      error: (error) => console.error(error)
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

    // Asegúrate de no intentar mostrar más noticias de las que existen
    if (nuevaCantidad <= this.noticias.length) {
      this.noticiasVisibles = this.noticias.slice(0, nuevaCantidad);
    } else {
      this.noticiasVisibles = this.noticias.slice(0, this.noticias.length);
    }

    // Si ya se mostraron todas las noticias, no se debe mostrar más el botón "Ver más"
    if (this.noticiasVisibles.length === this.noticias.length) {
      // No hacer nada, porque el botón "Ver más" ya no aparecerá si se han mostrado todas las noticias
    }
  }
  verMenosNoticias(): void {
    const nuevaCantidad = this.noticiasVisibles.length - this.incremento;

    if (nuevaCantidad >= this.cantidadInicial) {
      this.noticiasVisibles = this.noticias.slice(0, nuevaCantidad);
    } else {
      this.noticiasVisibles = this.noticias.slice(0, this.cantidadInicial);
    }
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

  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('opacity-0', 'translate-y-10');
          entry.target.classList.add('opacity-100', 'translate-y-0');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
  
    const sectionsToObserve = [
      this.carrerasSection,
      this.becasSection,
      this.eventosSection,
      this.noticiasSection,
      this.recorridoSection
    ];
  
    sectionsToObserve.forEach(section => {
      if (section && section.nativeElement) {
        observer.observe(section.nativeElement);
      }
    });
  }

 // Generar un token único
generarToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Función para verificar si el token ya existe en el LocalStorage y si está expirado
tokenExistente(): boolean {
  const token = localStorage.getItem('visita_token');
  const tokenExpiracion = localStorage.getItem('token_expiracion');
  
  if (token && tokenExpiracion) {
    const now = new Date().getTime();
    const expiracion = parseInt(tokenExpiracion, 10);

    // Si el token no ha expirado
    if (now < expiracion) {
      return true;  // El token es válido
    } else {
      // Si ha expirado, limpiar el LocalStorage
      this.limpiarLocalStorage();
    }
  }
  return false;
}

// Función para registrar la visita y generar el token
RegistrarVisita(): void {
  if (!this.tokenExistente()) {
    // Si el token no existe o ha expirado, generar uno nuevo
    const token = this.generarToken();
    
   // Definir la duración del token en milisegundos (1 día)
   const unDiaEnMilisegundos = 24 * 60 * 60 * 1000; // 1 día en milisegundos
   const expiracion = new Date().getTime() + unDiaEnMilisegundos;

    // Guardar el token y su expiración en el LocalStorage
    localStorage.setItem('visita_token', token);
    localStorage.setItem('token_expiracion', expiracion.toString());

    // Registrar la visita en el backend (si es necesario)
    this.visitasService.registrarVisitaConIp(token).subscribe({
      next: (response) => {
        //console.log('Visita registrada con éxito', response);
        this.getViewCount();
        this.visitaRegistrada = true; // Evitar múltiples registros
      },
      error: (error) => {
        //console.error('Error al registrar la visita', error);
      }
    });
  } else {
    //console.log('El token aún es válido, no se registra una nueva visita');
  }
}

// Función para limpiar el LocalStorage (llamada si el token ha expirado)
limpiarLocalStorage(): void {
  localStorage.removeItem('visita_token');
  localStorage.removeItem('token_expiracion');
}

// Función para obtener el número de visitas
getViewCount(): void {
  this.visitasService.ObtenerNumeroVisitas().subscribe(
    (response: any) => {
      this.viewCount = response.views;
    },
    (error) => {
      //console.error('Error al obtener el número de visitas:', error);
    }
  );
}

// Función para iniciar el ciclo de registro de visitas cada 10 segundos
iniciarCicloDeVisitas(): void {
  // Registrar visita inicialmente solo si no hay un token válido
  this.RegistrarVisita();

  // Usar setInterval para verificar y generar un nuevo token cada 10 segundos
  setInterval(() => {
    // Si el token ha expirado, limpiar el LocalStorage y generar uno nuevo
    if (!this.tokenExistente()) {
      this.limpiarLocalStorage();  // Limpiar el token anterior
      this.RegistrarVisita();      // Registrar una nueva visita
    }
  }, 10 * 1000); // Verificar cada 10 segundos (10 * 1000 ms)
}


}
