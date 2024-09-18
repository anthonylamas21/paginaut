import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Instalacion,
  InstalacionService,
} from '../../instalacionService/instalacion.service';
import Swal from 'sweetalert2';

class TooltipManager {
  static adjustTooltipPosition(
    button: HTMLElement,
    tooltip: HTMLElement
  ): void {
    const buttonRect = button.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const preferredLeft =
      buttonRect.left - tooltipRect.width / 2 + buttonRect.width / 2;
    const preferredTop = buttonRect.top - tooltipRect.height - 10;
    let left = Math.max(preferredLeft, 0);
    let top = Math.max(preferredTop, 0);

    if (left + tooltipRect.width > windowWidth) {
      left = windowWidth - tooltipRect.width;
    }

    if (top + tooltipRect.height > windowHeight) {
      top = windowHeight - tooltipRect.height;
    }

    tooltip.style.position = 'fixed';
    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
  }
}

@Component({
  selector: 'app-instalacion',
  templateUrl: './instalacion.component.html',
  styleUrls: ['./instalacion.component.css'],
})
export class InstalacionComponent implements OnInit {
  instalaciones: Instalacion[] = [];
  filteredInstalaciones: Instalacion[] = [];
  papeleraInstalaciones: Instalacion[] = [];
  instalacionForm: FormGroup;
  isModalOpen = false;
  currentInstalacionId: number | null = null;
  isLoading = false;
  responseMessage = '';
  baseImageUrl = 'http://localhost/paginaut/';
  imagenPrincipalPreview: string | ArrayBuffer | null = null;
  imagenesGeneralesActuales: string[] = [];
  isImageModalOpen = false;
  modalTitle = '';
  currentImageIndex = 0;
  allImages: string[] = [];
  titulo?: string;

  constructor(
    private instalacionService: InstalacionService,
    private fb: FormBuilder
  ) {
    this.instalacionForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(150), Validators.pattern(/^[a-zA-ZÀ-ÿ0-9\s\-.,()¡!"']+$/)]],
      resumen: ['', [Validators.maxLength(200), Validators.pattern(/^[a-zA-ZÀ-ÿ0-9\s\-.,()[]¡!"']+$/)]],
      activo: [true],
      imagen_principal: [null, Validators.required] // Validación para la imagen principal si es obligatoria
    });
  }

  ngOnInit(): void {
    this.loadInstalaciones();
    this.setNavbarColor();
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
      nabvar.classList.add('bg-[#043D3D]');
    }
  }

  loadInstalaciones(): void {
    this.instalacionService.obtenerInstalacion().subscribe({
      next: (response) => {
        this.instalaciones = response.records.map((instalacion) => ({
          ...instalacion,
          titulo: instalacion.nombre,
          imagen_principal: this.getImageUrl(instalacion.imagen_principal || ''),
          imagenes_generales: Array.isArray(instalacion.imagenes_generales)
            ? instalacion.imagenes_generales.map((img: any) => this.getImageUrl(img))
            : []
        }));
        this.filterInstalaciones();
      },
      error: (error) => console.error('Error al cargar instalaciones:', error),
    });
  }

  getImageUrl(relativePath: string | object): string {
    if (typeof relativePath === 'string') {
      // Si ya comienza con la URL base, devuélvela tal cual
      if (relativePath.startsWith(this.baseImageUrl)) {
        return relativePath;
      }
      // Si comienza con '../', quita eso antes de añadir la URL base
      if (relativePath.startsWith('../')) {
        return this.baseImageUrl + relativePath.substring(3);
      }
      // En otros casos, simplemente añade la URL base
      return this.baseImageUrl + relativePath;
    } else if (typeof relativePath === 'object' && relativePath !== null) {
      // Asume que el objeto tiene una propiedad 'ruta_imagen'
      const ruta = (relativePath as any).ruta_imagen;
      return this.getImageUrl(ruta); // Llama recursivamente con la ruta
    }
    return ''; // Retorna una cadena vacía si no se puede obtener la URL
  }



  filterInstalaciones(): void {
    this.filteredInstalaciones = this.instalaciones.filter(
      (instalacion) => instalacion.activo !== false
    );
    this.papeleraInstalaciones = this.instalaciones.filter(
      (instalacion) => instalacion.activo === false
    );
  }

  openModal(instalacion?: Instalacion): void {
    this.isModalOpen = true;
    if (instalacion) {
      this.currentInstalacionId = instalacion.id!;
      this.instalacionForm.patchValue(instalacion);
      this.imagenPrincipalPreview = instalacion.imagen_principal || null;
      this.imagenesGeneralesActuales = instalacion.imagenes_generales || [];
    } else {
      this.currentInstalacionId = null;
      this.instalacionForm.reset({ activo: true });
      this.imagenPrincipalPreview = null;
      this.imagenesGeneralesActuales = [];
    }
    this.clearFileInputs();
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.instalacionForm.reset();
    this.currentInstalacionId = null;
    this.imagenPrincipalPreview = null;
    this.imagenesGeneralesActuales = [];
    this.clearFileInputs();
  }

  clearFileInputs(): void {
    const imagenPrincipalInput = document.getElementById(
      'imagenPrincipal'
    ) as HTMLInputElement;
    const imagenesGeneralesInput = document.getElementById(
      'imagenesGenerales'
    ) as HTMLInputElement;
    if (imagenPrincipalInput) {
      imagenPrincipalInput.value = '';
    }
    if (imagenesGeneralesInput) {
      imagenesGeneralesInput.value = '';
    }
  }

  onSubmit(): void {
    if (this.instalacionForm.valid) {
      this.isLoading = true;
      const instalacionData: Instalacion = {
        ...this.instalacionForm.value,
        id: this.currentInstalacionId,
        imagen_principal: this.imagenPrincipalPreview as string,
        imagenes_generales: this.imagenesGeneralesActuales,
      };

      const imagenPrincipalInput = document.getElementById(
        'imagenPrincipal'
      ) as HTMLInputElement;
      const imagenPrincipal = imagenPrincipalInput.files?.[0];
      const imagenesGeneralesInput = document.getElementById(
        'imagenesGenerales'
      ) as HTMLInputElement;
      const imagenesGenerales = imagenesGeneralesInput.files;

      if (this.currentInstalacionId) {
        this.instalacionService
          .actualizarInstalacion(
            instalacionData,
            imagenPrincipal,
            imagenesGenerales ? Array.from(imagenesGenerales) : undefined
          )
          .subscribe({
            next: (response) => {
              this.showToast('success', 'Instalación actualizada con éxito');
              this.closeModal();
              this.loadInstalaciones();
            },
            error: (error) => {
              console.error('Error al actualizar la instalación:', error);
              this.showToast(
                'error',
                'Error al actualizar la instalación: ' +
                  (error.error?.message || error.message)
              );
            },
            complete: () => {
              this.isLoading = false;
            },
          });
      } else {
        this.instalacionService
          .crearInstalacion(
            instalacionData,
            imagenPrincipal,
            imagenesGenerales ? Array.from(imagenesGenerales) : undefined
          )
          .subscribe({
            next: (response) => {
              this.showToast('success', 'Instalación creada con éxito');
              this.closeModal();
              this.loadInstalaciones();
            },
            error: (error) => {
              console.error('Error al crear la instalación:', error);
              this.showToast(
                'error',
                'Error al crear la instalación: ' +
                  (error.error?.message || error.message)
              );
            },
            complete: () => {
              this.isLoading = false;
            },
          });
      }
    } else {
      this.showToast(
        'warning',
        'Por favor, complete todos los campos requeridos correctamente.'
      );
    }
  }

  confirmDeleteInstalacion(id: number): void {
    this.showConfirmDialog(
      '¿Estás seguro?',
      '¿Quieres eliminar esta instalación? Esta acción no se puede deshacer.',
      () => {
        this.instalacionService.eliminarInstalacion(id).subscribe({
          next: () => {
            this.showToast('success', 'Instalación eliminada con éxito');
            this.loadInstalaciones();
          },
          error: (error) => {
            this.showToast(
              'error',
              'Error al eliminar la instalación: ' +
                (error.error?.message || error.message)
            );
            console.error('Error:', error);
          },
        });
      }
    );
  }

  desactivarInstalacion(id: number): void {
    this.showConfirmDialog(
      '¿Estás seguro?',
      '¿Quieres desactivar esta instalación? No será visible para los usuarios.',
      () => {
        this.instalacionService.desactivarInstalacion(id).subscribe({
          next: () => {
            this.showToast('success', 'Instalación desactivada con éxito');
            this.loadInstalaciones();
          },
          error: (error) => {
            this.showToast(
              'error',
              'Error al desactivar la instalación: ' +
                (error.error?.message || error.message)
            );
            console.error('Error:', error);
          },
        });
      }
    );
  }

  activarInstalacion(id: number): void {
    this.showConfirmDialog(
      '¿Estás seguro?',
      '¿Quieres activar esta instalación? Será visible para los usuarios.',
      () => {
        this.instalacionService.activarInstalacion(id).subscribe({
          next: () => {
            this.showToast('success', 'Instalación activada con éxito');
            this.loadInstalaciones();
          },
          error: (error) => {
            this.showToast(
              'error',
              'Error al activar la instalación: ' +
                (error.error?.message || error.message)
            );
            console.error('Error:', error);
          },
        });
      }
    );
  }

  filterGlobal(event: any): void {
    const searchValue = event.target.value.toLowerCase();
    this.filteredInstalaciones = this.instalaciones.filter(
      (instalacion) =>
        (instalacion.titulo &&
          instalacion.titulo.toLowerCase().includes(searchValue)) ||
        (instalacion['fecha_creacion'] &&
          instalacion['fecha_creacion'].toLowerCase().includes(searchValue))
    );
  }

  onFileChangePrincipal(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagenPrincipalPreview = e.target.result;
        this.instalacionForm.get('imagen_principal')?.setValue(file); // Actualiza el valor del campo de imagen principal
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
    if (
      this.currentInstalacionId &&
      imagenParaEliminar.startsWith(this.baseImageUrl)
    ) {
      const relativePath = imagenParaEliminar.replace(this.baseImageUrl, '');
      this.instalacionService
        .eliminarImagenGeneral(this.currentInstalacionId, relativePath)
        .subscribe({
          next: () => {
            this.imagenesGeneralesActuales.splice(index, 1);
          },
          error: (error) => {
            console.error('Error al eliminar la imagen:', error);
          },
        });
    } else {
      this.imagenesGeneralesActuales.splice(index, 1);
    }
  }

  openImageModal(instalacion: Instalacion, type: 'principal' | 'generales'): void {
    this.isImageModalOpen = true;
    this.currentImageIndex = 0;
    if (type === 'principal') {
      this.modalTitle = 'Imagen Principal';
      this.allImages = [instalacion.imagen_principal!];
    } else {
      this.modalTitle = 'Imágenes Generales';
      this.allImages = instalacion.imagenes_generales || [];
    }
  }

  closeImageModal(): void {
    this.isImageModalOpen = false;
  }

  getCurrentImage(): string {
    return this.allImages[this.currentImageIndex] || '';
  }

  nextImage(): void {
    this.currentImageIndex =
      (this.currentImageIndex + 1) % this.allImages.length;
  }

  prevImage(): void {
    this.currentImageIndex =
      (this.currentImageIndex - 1 + this.allImages.length) %
      this.allImages.length;
  }

  getTotalImagesCount(): number {
    return this.allImages.length;
  }

  switchTab(tab: 'active' | 'inactive'): void {
    if (tab === 'active') {
      this.filteredInstalaciones = this.instalaciones.filter(
        (instalacion) => instalacion.activo !== false
      );
    } else {
      this.filteredInstalaciones = this.papeleraInstalaciones;
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.instalacionForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.instalacionForm.get(fieldName);
    if (field?.errors?.['required']) {
      return 'Este campo es requerido.';
    }
    if (field?.errors?.['maxlength']) {
      return `Máximo ${field.errors['maxlength'].requiredLength} caracteres.`;
    }
    return '';
  }

  private updateInstalacionesArray(instalacion: Instalacion): void {
    const index = this.instalaciones.findIndex((n) => n.id === instalacion.id);
    if (index !== -1) {
      this.instalaciones[index] = instalacion;
      this.filterInstalaciones();
    }
  }

  private removeInstalacionFromArray(id: number): void {
    this.instalaciones = this.instalaciones.filter((n) => n.id !== id);
    this.filterInstalaciones();
  }

  private updateInstalacionStatus(id: number, status: boolean): void {
    const index = this.instalaciones.findIndex((n) => n.id === id);
    if (index !== -1) {
      this.instalaciones[index].activo = status;
      this.filterInstalaciones();
    }
  }

  private showToast(
    icon: 'success' | 'warning' | 'error' | 'info' | 'question',
    title: string
  ): void {
    const iconColors = {
      success: '#008779',
      warning: '#FD9B63',
      error: '#EF4444',
      info: '#3ABEF9',
      question: '#5A72A0',
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
      },
    });

    Toast.fire({
      icon: icon,
      title: title,
    });
  }

  private showConfirmDialog(
    title: string,
    text: string,
    onConfirm: () => void
  ): void {
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
      },
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm();
      }
    });
  }

  mostrar(elemento: any): void {
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
          TooltipManager.adjustTooltipPosition(elemento, tooltipContent);
        }
      }
    }
  }
}
