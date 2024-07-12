import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NoticiaService, Noticia } from '../../noticia.service';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
  baseImageUrl = 'http://localhost/paginaut/';
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

  constructor(
    private noticiaService: NoticiaService,
    private fb: FormBuilder
  ) {
    this.noticiaForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(50)]],
      resumen: ['', [Validators.required, Validators.maxLength(200)]],
      informacion_noticia: ['', Validators.required],
      activo: [true],
      lugar_noticia: ['', [Validators.required, Validators.maxLength(50)]],
      autor: ['', [Validators.required, Validators.maxLength(50)]],
      fecha_publicacion: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadNoticias();

    // Suscribirse a los cambios del formulario
    this.noticiaForm.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        // No hacemos nada aquí, solo queremos que se dispare la detección de cambios
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadNoticias(): void {
    this.noticiaService.obtenerNoticias().subscribe({
      next: (response) => {
        this.noticias = response.records.map(noticia => ({
          ...noticia,
          imagen_principal: this.getImageUrl(noticia.imagen_principal || ''),
          imagenes_generales: (noticia.imagenes_generales || []).map((img: string) => this.getImageUrl(img))
        }));
        this.filterNoticias();
      },
      error: (error) => console.error('Error al cargar noticias:', error)
    });
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
            console.error('Error al actualizar la noticia:', error);
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
            console.error('Error al crear la noticia:', error);
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
          console.error('Error:', error);
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
          console.error('Error:', error);
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
          console.error('Error:', error);
        }
      });
    });
  }

  filterGlobal(event: any): void {
    const searchValue = event.target.value.toLowerCase();
    this.filteredNoticias = this.noticias.filter(noticia =>
      noticia.titulo.toLowerCase().includes(searchValue) ||
      noticia.resumen.toLowerCase().includes(searchValue) ||
      noticia.informacion_noticia.toLowerCase().includes(searchValue) ||
      noticia.lugar_noticia.toLowerCase().includes(searchValue) ||
      noticia.autor.toLowerCase().includes(searchValue)
    );
  }

  onFileChangePrincipal(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagenPrincipalPreview = e.target.result;
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
