import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NoticiaService, Noticia } from '../noticia.service';
import Hashids from 'hashids';
import { BASEIMAGEN, Informacion } from '../constans';

@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.component.html',
  styleUrls: ['./noticias.component.css']
})
export class NoticiasComponent implements OnInit {

  private hashids = new Hashids('X9f2Kp7Lm3Qr8Zw5Yt6Vb1Nj4Hg', 16);
  idDecrypted: number | undefined;
  
  isLoading = true;
  noticia: Noticia | null = null;
  error: string | null = null;
  imagenAmpliada: string | null = null;
  informacion = Informacion;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private noticiaService: NoticiaService
  ) {
    // Desencriptar el ID en el constructor
    const encryptedId = this.route.snapshot.paramMap.get('id');
    if (encryptedId) {
      this.idDecrypted = this.hashids.decode(encryptedId)[0] as number;
    } else {
      // console.error('ID de noticia no disponible');
    }
  }

  ngOnInit(): void {
    this.setNavbarColor();
    this.loadNoticia();
  }

  loadNoticia(): void {
    if (this.idDecrypted !== undefined) {
      this.noticiaService.obtenerNoticia(this.idDecrypted).subscribe({
        next: (noticia: Noticia) => {
          this.noticia = this.addFormattedDate(noticia);          
          this.isLoading = false;
        },
        error: (error: any) => {
          // console.error('Error al cargar la noticia:', error);
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
    const baseImageUrl = BASEIMAGEN+'/';
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
      navbar.classList.add('bg-primary-color');
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
    // console.log("Imagen ampliada:", imagenUrl);
  }

  cerrarImagenAmpliada(): void {
    this.imagenAmpliada = null;
  }

  private addFormattedDate(noticia: Noticia): Noticia & { fecha_string: string} {
    return {
      ...noticia,
      // Pasamos la fecha como string, que luego se formatea correctamente
      fecha_string: this.formatDateString(noticia.fecha_publicacion),
    };
  }
  
  formatDateString(dateString: string): string {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
  
    // Asegurarse de que la fecha está en formato YYYY-MM-DD antes de procesarla
    const dateParts = dateString.split(' ')[0].split('-'); // Extrae solo la fecha en formato YYYY-MM-DD (sin la hora)
    const year = dateParts[0];
    const month = months[parseInt(dateParts[1], 10) - 1]; // Mes (1-12)
    const day = ('0' + dateParts[2]).slice(-2); // Día (si tiene un solo dígito, lo pone con cero a la izquierda)
  
    return `${day} de ${month} , ${year}`;
  }
}
