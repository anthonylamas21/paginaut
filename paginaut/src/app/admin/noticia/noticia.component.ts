import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NoticiaService, Noticia } from '../../noticia.service';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BASEIMAGEN } from '../../constans';
import { soloLetras, soloLetrasConPuntuacion } from '../../validaciones';

class TooltipManager {
  static adjustTooltipPosition(
    button: HTMLElement,
    tooltip: HTMLElement
  ): void {
    // Obtener dimensiones del botón y del tooltip
    const buttonRect = button.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    // Obtener dimensiones de la ventana
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Calcular la posición preferida del tooltip
    const preferredLeft =
      buttonRect.left - tooltipRect.width / 2 + buttonRect.width / 2;
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

interface NoticiaTemporal extends Noticia {
  imagenesGeneralesOriginales?: string[];
  imagenPrincipalOriginal?: string;
}

@Component({
  selector: 'app-noticia',
  templateUrl: './noticia.component.html',
  styleUrls: ['./noticia.component.css']
})
export class NoticiaComponent implements OnInit, OnDestroy {
  noticias: Noticia[] = [];
  filteredNoticias: Noticia[] = [];
  papeleraNoticias: Noticia[] = [];
  noticiaForm: FormGroup;
  isModalOpen = false;
  currentNoticiaId: number | null = null;
  isLoading = false;
  responseMessage = '';
  baseImageUrl = BASEIMAGEN+'/';
  imagenPrincipalPreview: string | ArrayBuffer | null = null;
  imagenesGeneralesActuales: string[] = [];
  isImageModalOpen = false;
  modalTitle = '';
  currentImageIndex = 0;
  allImages: string[] = [];
  imagenesParaEliminar: string[] = [];
  noticiaTemporal: NoticiaTemporal | null = null;
  isDetailsModalOpen = false;
  selectedNoticia: Noticia | null = null;
  private unsubscribe$ = new Subject<void>();
  minDate: string;
  maxDate: string;

  constructor(
    private noticiaService: NoticiaService,
    private fb: FormBuilder,
  ) {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear, 0, 1).toISOString().split('T')[0];  // 1 de enero del año actual
    this.maxDate = new Date(currentYear, 11, 31).toISOString().split('T')[0]; // 31 de diciembre del año actual

    this.noticiaForm = this.fb.group({
      titulo: ['', [ soloLetras(true), Validators.required, Validators.minLength(10), Validators.maxLength(50)]],
      resumen: ['', [ soloLetrasConPuntuacion(true), Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      informacion_noticia: ['', [ soloLetrasConPuntuacion(true), Validators.required, Validators.minLength(15), Validators.maxLength(2000)]],
      activo: [true],
      lugar_noticia: ['', [soloLetrasConPuntuacion(true), Validators.required, Validators.minLength(10), Validators.maxLength(50)]],
      autor: ['', [ soloLetras(true),Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      fecha_publicacion: ['', Validators.required],
      imagen_principal: [null, Validators.required] // Validación para la imagen principal
    });
  }

  ngOnInit(): void {
    
    this.loadNoticias();
    this.setNavbarColor(); 

    // Suscribirse a los cambios del formulario
    this.noticiaForm.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        // No hacemos nada aquí, solo queremos que se dispare la detección de cambios
      });
  }
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.setNavbarColor();
  }

  scrollToSection(sectionId: string): void {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
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

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadNoticias(): void {
    this.noticiaService.obtenerNoticias().subscribe({
      next: (response) => { 
        this.noticias = response.records.map((noticia) => {
          // Agregar las fechas y horarios formateados
          const noticiaConFechasFormateadas = this.addFormattedDate(noticia);
  
          // Retornar el noticia con las imágenes y fechas formateadas
          return {
            ...noticiaConFechasFormateadas,
            imagen_principal: this.getImageUrl(noticia.imagen_principal || ''),
            imagenes_generales: (noticia.imagenes_generales || []).map((img: string) => this.getImageUrl(img)),
          };
        });
        this.filterNoticias(); // Esto filtra o realiza otras operaciones necesarias
      }
    });
  }

  private addFormattedDate(noticia: Noticia): Noticia & { fecha_string: string } {
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
  
    return `${month} ${day}, ${year}`;
  }

  formatHorarioString(timeString: string): string {
    const timeParts = timeString.split(':');
    let hours = parseInt(timeParts[0]);
    const minutes = timeParts[1];
    let period = 'AM';
  
    // Convertir la hora a formato 12 horas
    if (hours >= 12) {
      if (hours > 12) hours -= 12; // Convertir hora mayor que 12 a formato de 12 horas
      period = 'PM';
    } else if (hours === 0) {
      hours = 12; // La medianoche se representa como 12:00 AM
      period = 'AM';
    }
  
    // Ajustar el formato de la hora con un cero a la izquierda si es necesario
    const formattedHour = ('0' + hours).slice(-2);
  
    return `${formattedHour}:${minutes} ${period}`;
  }


  getImageUrl(relativePath: string): string {
    if (relativePath && relativePath.startsWith('../')) {
      return this.baseImageUrl + relativePath.substring(3);
    }
    return this.baseImageUrl + relativePath;
  }

  filterNoticias(): void {
    this.filteredNoticias = this.noticias.filter(noticia => noticia.activo !== false);
    this.papeleraNoticias = this.noticias.filter(noticia => noticia.activo === false);
  }

  openModal(noticia?: Noticia): void {
    this.isModalOpen = true;
    if (noticia) {
      this.currentNoticiaId = noticia.id!;

      this.noticiaForm.patchValue(noticia);

      this.imagenPrincipalPreview = noticia.imagen_principal || null;
      this.imagenesGeneralesActuales = [...noticia.imagenes_generales || []];
    } else {
      this.currentNoticiaId = null;
      this.noticiaTemporal = null;
      this.noticiaForm.reset({ activo: true });
      this.imagenPrincipalPreview = null;
      this.imagenesGeneralesActuales = [];
    }
    this.clearFileInputs();
  }

  closeModal(): void {
    if (this.noticiaTemporal) {
      // Restaurar los valores originales
      const noticiaOriginal = this.noticias.find(n => n.id === this.currentNoticiaId);
      if (noticiaOriginal) {
        noticiaOriginal.imagen_principal = this.noticiaTemporal.imagenPrincipalOriginal;
        noticiaOriginal.imagenes_generales = this.noticiaTemporal.imagenesGeneralesOriginales;
      }
    }

    this.isModalOpen = false;
    this.noticiaForm.reset();
    this.currentNoticiaId = null;
    this.noticiaTemporal = null;
    this.imagenPrincipalPreview = null;
    this.imagenesGeneralesActuales = [];
    this.imagenesParaEliminar = [];
    this.clearFileInputs();
  }

  clearFileInputs(): void {
    const imagenPrincipalInput = document.getElementById('imagenPrincipal') as HTMLInputElement;
    const imagenesGeneralesInput = document.getElementById('imagenesGenerales') as HTMLInputElement;
    if (imagenPrincipalInput) {
      imagenPrincipalInput.value = '';
    }
    if (imagenesGeneralesInput) {
      imagenesGeneralesInput.value = '';
    }
  }

  onSubmit(): void {
    if (this.noticiaForm.valid) {
      this.isLoading = true;
      const noticiaData: Noticia = {
        ...this.noticiaForm.value,
        id: this.currentNoticiaId,
        imagen_principal: this.imagenPrincipalPreview as string,
        imagenes_generales: this.imagenesGeneralesActuales
      };

      const imagenPrincipalInput = document.getElementById('imagenPrincipal') as HTMLInputElement;
      const imagenPrincipal = imagenPrincipalInput.files?.[0];
      const imagenesGeneralesInput = document.getElementById('imagenesGenerales') as HTMLInputElement;
      const imagenesGenerales = imagenesGeneralesInput.files;

      if (this.currentNoticiaId) {
        // Primero, elimina las imágenes marcadas
        const deletePromises: Promise<any>[] = this.imagenesParaEliminar.map(ruta =>
          this.noticiaService.eliminarImagenGeneral(this.currentNoticiaId!, ruta).toPromise()
        );

        Promise.all(deletePromises)
          .then(() => {
            // Luego, actualiza la noticia
            return this.noticiaService.actualizarNoticia(
              noticiaData,
              imagenPrincipal,
              imagenesGenerales ? Array.from(imagenesGenerales) : undefined
            ).toPromise();
          })
          .then(() => {
            this.showToast('success', 'Noticia actualizada con éxito');
            this.closeModal();
            this.loadNoticias();
          })
          .catch(error => {
            // console.error('Error al actualizar la noticia:', error);
            this.showToast('error', 'Error al actualizar la noticia: ' + (error.error?.message || error.message));
          })
          .finally(() => {
            this.isLoading = false;
            this.imagenesParaEliminar = [];
          });
      } else {
        this.noticiaService.crearNoticia(
          noticiaData,
          imagenPrincipal,
          imagenesGenerales ? Array.from(imagenesGenerales) : undefined
        ).subscribe({
          next: (response) => {
            this.showToast('success', 'Noticia creada con éxito');
            this.closeModal();
            this.loadNoticias();
          },
          error: (error) => {
            // console.error('Error al crear la noticia:', error);
            this.showToast('error', 'Error al crear la noticia: ' + (error.error?.message || error.message));
          },
          complete: () => {
            this.isLoading = false;
          }
        });
      }
    } else {
      this.showToast('warning', 'Por favor, complete todos los campos requeridos correctamente.');
      // Marcar todos los campos como tocados para mostrar los errores
      Object.keys(this.noticiaForm.controls).forEach(key => {
        const control = this.noticiaForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  isFormValid(): boolean {
    return this.noticiaForm.valid;
  }

  confirmDeleteNoticia(id: number): void {
    this.showConfirmDialog('¿Estás seguro de que quieres eliminar esta noticia?', 'Esta acción no se puede deshacer.', () => {
      this.noticiaService.eliminarNoticia(id).subscribe({
        next: () => {
          this.showToast('success', 'La noticia ha sido eliminada.');
          this.loadNoticias();
        },
        error: (error) => {
          this.showToast('error', 'Error al eliminar la noticia: ' + (error.error?.message || error.message));
          // console.error('Error:', error);
        }
      });
    });
  }

  desactivarNoticia(id: number): void {
    this.showConfirmDialog('¿Estás seguro de que quieres desactivar esta noticia?', 'La noticia no será visible para los usuarios.', () => {
      this.noticiaService.desactivarNoticia(id).subscribe({
        next: () => {
          this.showToast('success', 'La noticia ha sido desactivada.');
          this.loadNoticias();
        },
        error: (error) => {
          this.showToast('error', 'Error al desactivar la noticia: ' + (error.error?.message || error.message));
          // console.error('Error:', error);
        }
      });
    });
  }

  activarNoticia(id: number): void {
    this.showConfirmDialog('¿Estás seguro de que quieres activar esta noticia?', 'La noticia será visible para los usuarios.', () => {
      this.noticiaService.activarNoticia(id).subscribe({
        next: () => {
          this.showToast('success', 'La noticia ha sido activada.');
          this.loadNoticias();
        },
        error: (error) => {
          this.showToast('error', 'Error al activar la noticia: ' + (error.error?.message || error.message));
          // console.error('Error:', error);
        }
      });
    });
  }

  filterGlobal(event: any): void {
    const searchValue = event.target.value.toLowerCase();
    this.filteredNoticias = this.noticias.filter((noticia) => {
      // Filtrar por convocatorias inactivas (suponiendo que tienes una propiedad "activo" que es true/false)
      return noticia.activo && (
        (noticia.titulo?.toLowerCase().includes(searchValue) || '') ||
        (noticia.lugar_noticia?.toLowerCase().includes(searchValue) || '') ||
        (noticia.fecha_string?.toLowerCase().includes(searchValue) || '') ||
        noticia.autor.toLowerCase().includes(searchValue)
      );
    });
  }

  filterGlobalInactive(event: any): void {
    const searchValue = event.target.value.toLowerCase();
    this.papeleraNoticias = this.noticias.filter((noticia) => {
      // Filtrar por convocatorias inactivas (suponiendo que tienes una propiedad "activo" que es true/false)
      return !noticia.activo && (
        (noticia.titulo?.toLowerCase().includes(searchValue) || '') ||
        (noticia.lugar_noticia?.toLowerCase().includes(searchValue) || '') ||
        (noticia.fecha_string?.toLowerCase().includes(searchValue) || '') ||
        noticia.autor.toLowerCase().includes(searchValue)
      );
    });
  }

  onFileChangePrincipal(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagenPrincipalPreview = e.target.result;
        this.noticiaForm.get('imagen_principal')?.setValue(file); // Actualiza el control de la imagen principal
      };
      reader.readAsDataURL(file);
    }
  }


  onFileChangeGenerales(event: any): void {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagenesGeneralesActuales.push(e.target.result);
        };
        reader.readAsDataURL(files[i]);
      }
    }
  }

  removeImagenGeneral(index: number): void {
    const imagenParaEliminar = this.imagenesGeneralesActuales[index];
    if (this.currentNoticiaId && imagenParaEliminar.startsWith(this.baseImageUrl)) {
      const relativePath = imagenParaEliminar.replace(this.baseImageUrl, '');
      this.imagenesParaEliminar.push(relativePath);
    }
    this.imagenesGeneralesActuales.splice(index, 1);
  }

  openImageModal(noticia: Noticia, type: 'principal' | 'generales'): void {
    this.isImageModalOpen = true;
    this.currentImageIndex = 0;
    if (type === 'principal') {
      this.modalTitle = 'Imagen Principal';
      this.allImages = [noticia.imagen_principal!];
    } else {
      this.modalTitle = 'Imágenes Generales';
      this.allImages = noticia.imagenes_generales || [];
    }
  }

  closeImageModal(): void {
    this.isImageModalOpen = false;
  }

  getCurrentImage(): string {
    return this.allImages[this.currentImageIndex];
  }

  nextImage(): void {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.allImages.length;
  }

  prevImage(): void {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.allImages.length) % this.allImages.length;
  }

  getTotalImagesCount(): number {
    return this.allImages.length;
  }

  switchTab(tab: 'active' | 'inactive'): void {
    if (tab === 'active') {
      this.filteredNoticias = this.noticias.filter(noticia => noticia.activo !== false);
    } else {
      this.filteredNoticias = this.papeleraNoticias;
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.noticiaForm.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched)) : false;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.noticiaForm.get(fieldName);
    if (field?.errors?.['required']) {
      return 'Este campo es requerido.';
    }
    if (field?.errors?.['maxlength']) {
      return `Máximo ${field.errors['maxlength'].requiredLength} caracteres.`;
    }
    if (field?.errors?.['pattern']) {
      return 'Formato no válido. Solo se permiten letras, números y algunos caracteres especiales.';
    }
    return '';
  }


  private updateNoticiasArray(noticia: Noticia): void {
    const index = this.noticias.findIndex(n => n.id === noticia.id);
    if (index !== -1) {
      this.noticias[index] = noticia;
      this.filterNoticias();
    }
  }

  private removeNoticiaFromArray(id: number): void {
    this.noticias = this.noticias.filter(n => n.id !== id);
    this.filterNoticias();
  }

  private updateNoticiaStatus(id: number, status: boolean): void {
    const index = this.noticias.findIndex(n => n.id === id);
    if (index !== -1) {
      this.noticias[index].activo = status;
      this.filterNoticias();
    }
  }

  private showToast(icon: 'success' | 'warning' | 'error' | 'info' | 'question', title: string): void {
    const iconColors = {
      success: '#008779',
      warning: '#FD9B63',
      error: '#EF4444',
      info: '#3ABEF9',
      question: '#5A72A0'
    };

    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      iconColor: iconColors[icon],
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });

    Toast.fire({
      icon: icon,
      title: title
    });
  }

  private showConfirmDialog(title: string, text: string, onConfirm: () => void): void {
    Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      iconColor: '#FD9B63',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#E5E7EB',
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      focusCancel: true,
      didOpen: () => {
        const confirmButton = Swal.getConfirmButton();
        if (confirmButton) {
          confirmButton.style.color = 'white';
        }
        const cancelButton = Swal.getCancelButton();
        if (cancelButton) {
          cancelButton.style.color = 'black';
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm();
      }
    });
  }

  openDetailsModal(noticia: Noticia): void {
    this.selectedNoticia = noticia;
    this.isDetailsModalOpen = true;
  }

  closeDetailsModal(): void {
    this.isDetailsModalOpen = false;
    this.selectedNoticia = null;
  }

  mostrar(elemento: any): void {
    // Verifica si el elemento recibido es un botón
    if (elemento.tagName.toLowerCase() === 'button') {
      const tooltipElement = elemento.querySelector('.hs-tooltip');
      if (tooltipElement) {
        tooltipElement.classList.toggle('show');
        const tooltipContent = tooltipElement.querySelector(
          '.hs-tooltip-content'
        );
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
