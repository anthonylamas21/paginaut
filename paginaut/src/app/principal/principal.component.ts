import { Component, HostListener, OnInit } from '@angular/core';
import { EventoService, Evento } from '../evento.service';
import { NoticiaService, Noticia } from '../noticia.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {

  private secretKey = 'X9f2Kp7Lm3Qr8Zw5Yt6Vb1Nj4Hg'; // Usa una clave segura en producción
  eventosRecientes: Evento[] = [];
  noticias: Noticia[] = [];
  noticiasVisibles: Noticia[] = [];
  cantidadInicial = 3;
  incremento = 3;

  encryptedToken: string | null;
  encryptedRol: string | null;
  encryptedDepa: string | null;


  constructor(
    private eventoService: EventoService,
    private noticiaService: NoticiaService
  ) {

    this.encryptedToken = localStorage.getItem('token');
    this.encryptedRol = localStorage.getItem('rol');
    this.encryptedDepa = localStorage.getItem('depa');
  }

  private decrypt(encrypted: string): string {
    return CryptoJS.AES.decrypt(encrypted, this.secretKey).toString(CryptoJS.enc.Utf8);
  }

  ngOnInit() {
    this.cargarEventosRecientes();
    this.cargarNoticiasActivas();
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

}
