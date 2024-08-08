import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NoticiaService, Noticia } from '../noticia.service';

@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.component.html',
  styleUrls: ['./noticias.component.css']
})
export class NoticiasComponent implements OnInit {
  isLoading = true;
  noticia: Noticia | null = null;
  error: string | null = null;
  imagenAmpliada: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private noticiaService: NoticiaService
  ) {}

  ngOnInit(): void {
    this.setNavbarColor();
    this.loadNoticia();
  }

  loadNoticia(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.noticiaService.obtenerNoticia(+id).subscribe({
        next: (noticia: Noticia) => {
          this.noticia = noticia;
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Error al cargar la noticia:', error);
          this.error = 'No se pudo cargar la noticia. Por favor, inténtalo de nuevo más tarde.';
          this.isLoading = false;
        }
      });
    } else {
      this.error = 'No se especificó un ID de noticia válido.';
      this.isLoading = false;
    }
  }

  getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || '';
  }

  getImageUrl(relativePath: string | undefined): string {
    if (!relativePath) {
      return 'assets/img/default-news-image.jpg'; // Asegúrate de tener una imagen por defecto
    }
    const baseImageUrl = 'http://localhost/paginaut/';
    if (relativePath.startsWith('../')) {
      return baseImageUrl + relativePath.substring(3);
    }
    return baseImageUrl + relativePath;
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.setNavbarColor();
  }

  private setNavbarColor(): void {
    const button = document.getElementById('scrollTopButton');
    const navbar = document.getElementById('navbarAccion');
    const inicioSection = document.getElementById('inicio');

    if (inicioSection && navbar) {
      const inicioSectionBottom = inicioSection.getBoundingClientRect().bottom;

      if (window.scrollY > inicioSectionBottom) {
        button?.classList.remove('hidden');
      } else {
        button?.classList.add('hidden');
      }
      
      navbar.classList.remove('bg-transparent');
      navbar.classList.add('bg-[#043D3D]');
    }
  }

  scrollToSection(sectionId: string): void {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  }

  volverANoticias(): void {
    this.router.navigate(['/noticias']); // Asegúrate de tener una ruta para la lista de noticias
  }
  ampliarImagen(imagenUrl: string): void {
    this.imagenAmpliada = imagenUrl;
    console.log("se amplio");
  }

  cerrarImagenAmpliada(): void {
    this.imagenAmpliada = null;
  }
}