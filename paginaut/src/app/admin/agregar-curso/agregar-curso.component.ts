import { Component, OnInit } from '@angular/core';
import { CursoService, Curso } from '../../cursoService/curso.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

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

@Component({
  selector: 'app-agregar-curso',
  templateUrl: './agregar-curso.component.html',
  styleUrl: './agregar-curso.component.css',
})
export class AgregarCursoComponent implements OnInit {
  cursos: Curso[] = [];
  filteredCursos: Curso[] = [];
  papeleraCursos: Curso[] = [];
  cursoForm: FormGroup;
  isModalOpen = false;
  currentCursoId: number | null = null;
  isLoading = false;
  responseMessage = '';
  baseImageUrl = 'http://localhost/paginaut/';
  imagenPrincipalPreview: string | ArrayBuffer | null = null;
  imagenesGeneralesActuales: string[] = [];
  isImageModalOpen = false;
  modalTitle = '';
  currentImageIndex = 0;
  allImages: string[] = [];
  profesores: any[] = [];
  selectedProfesores: Set<number> = new Set();

  constructor(
    private cursoService: CursoService,
    private fb: FormBuilder
  ) {
    this.cursoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      descripcion: ['', Validators.maxLength(200)],
      activo: [true],
      imagenPrincipal: [null],  // Campo para la imagen principal
      imagenesGenerales: [[]], 
    });
  }

  ngOnInit(): void {
    this.loadCursos();
    this.loadProfesores();
  }

  loadProfesores(): void {
    this.cursoService.GetProfesores().subscribe(
      (res) => {
        this.profesores = res.records;
      },
      (err) => {
        console.error("Error al cargar profesores:", err);
      }
    );
  }

  toggleSelection(profesorId: number): void {
    if (this.selectedProfesores.has(profesorId)) {
      this.selectedProfesores.delete(profesorId);
    } else {
      this.selectedProfesores.add(profesorId);
    }
  }

  isSelected(profesorId: number): boolean {
    return this.selectedProfesores.has(profesorId);
  }

  loadCursos(): void {
    this.cursoService.obtenerCurso().subscribe({
      next: (response) => {
        this.cursos = response.records.map((curso) => ({
          ...curso,
          titulo: curso.nombre,
          imagen_principal: this.getImageUrl(curso.imagen_principal || ''),
          imagenes_generales: (curso.imagenes_generales || []).map(
            (img: string) => this.getImageUrl(img)
          ),
        }));
        this.filterCursos();
      },
      error: (error) => console.error(error),
    });
  }

  getImageUrl(relativePath: string): string {
    return this.baseImageUrl + relativePath;
  }

  filterCursos(): void {
    this.filteredCursos = this.cursos.filter((curso) => curso.activo !== false);
    this.papeleraCursos = this.cursos.filter((curso) => curso.activo === false);
  }

  openModal(curso?: Curso): void {
    this.isModalOpen = true;
    if (curso) {
      this.currentCursoId = curso.id!;
      this.cursoForm.patchValue(curso);
      this.imagenPrincipalPreview = curso.imagen_principal || null;
      this.imagenesGeneralesActuales = curso.imagenes_generales || [];
    } else {
      this.currentCursoId = null;
      this.cursoForm.reset({ activo: true });
      this.imagenPrincipalPreview = null;
      this.imagenesGeneralesActuales = [];
    }
    this.clearFileInputs();
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.cursoForm.reset();
    this.currentCursoId = null;
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
    if (this.cursoForm.valid) {
        this.isLoading = true;
        const formData: FormData = new FormData();

        formData.append('nombre', this.cursoForm.get('nombre')!.value);
        formData.append('descripcion', this.cursoForm.get('descripcion')!.value);
        formData.append('activo', this.cursoForm.get('activo')!.value.toString());

        const imagenPrincipal = this.cursoForm.get('imagenPrincipal')?.value;
        if (imagenPrincipal) {
            formData.append('imagen_principal', imagenPrincipal);
        }

        const imagenesGenerales = this.cursoForm.get('imagenesGenerales')?.value;
        if (imagenesGenerales && imagenesGenerales.length) {
            // Crear un array en FormData
            imagenesGenerales.forEach((file: any) => {
                formData.append('imagenes_generales[]', file);
            });
        }

        formData.append('profesores', JSON.stringify(Array.from(this.selectedProfesores)));

        const cursoObservable = this.currentCursoId
            ? this.cursoService.actualizarCurso(formData, this.currentCursoId)
            : this.cursoService.crearCursoConProfesores(formData);

        cursoObservable.subscribe({
            next: () => {
                this.showToast('success', this.currentCursoId ? 'Curso actualizado con éxito' : 'Curso creado con éxito');
                this.closeModal();
                this.loadCursos();
            },
            error: (error) => {
                console.error('Error al procesar el curso:', error);
                this.showToast('error', 'Error al procesar el curso');
            },
            complete: () => {
                this.isLoading = false;
            },
        });
    } else {
        this.showToast('warning', 'Por favor, complete todos los campos requeridos correctamente.');
    }
}


  guardarProfesores(cursoId: number): void {
    if (this.selectedProfesores.size > 0) {
      const profesoresData = {
        cursoId: cursoId,
        profesores: Array.from(this.selectedProfesores),
      };

      this.cursoService.asignarProfesores(profesoresData).subscribe({
        next: (response) => {
          console.log('Profesores asignados con éxito:', response);
        },
        error: (error) => {
          console.error('Error al asignar los profesores:', error);
          this.showToast(
            'error',
            'Error al asignar los profesores: ' +
              (error.error?.message || error.message)
          );
        },
      });
    }
  }

  confirmDeleteCurso(id: number): void {
    this.showConfirmDialog(
      '¿Estás seguro?',
      '¿Quieres eliminar este curso? Esta acción no se puede deshacer.',
      () => {
        this.cursoService.eliminarCurso(id).subscribe({
          next: () => {
            this.showToast('success', 'Curso eliminado con éxito');
            this.loadCursos();
          },
          error: (error) => {
            this.showToast(
              'error',
              'Error al eliminar el curso: ' +
                (error.error?.message || error.message)
            );
            console.error('Error:', error);
          },
        });
      }
    );
  }

  desactivarCurso(id: number): void {
    this.showConfirmDialog(
      '¿Estás seguro?',
      '¿Quieres desactivar este curso? No será visible para los usuarios.',
      () => {
        this.cursoService.desactivarCurso(id).subscribe({
          next: () => {
            this.showToast('success', 'Curso desactivado con éxito');
            this.loadCursos();
          },
          error: (error) => {
            this.showToast(
              'error',
              'Error al desactivar el curso: ' +
                (error.error?.message || error.message)
            );
            console.error('Error:', error);
          },
        });
      }
    );
  }

  activarCurso(id: number): void {
    this.showConfirmDialog(
      '¿Estás seguro?',
      '¿Quieres activar este curso? Será visible para los usuarios.',
      () => {
        this.cursoService.activarCurso(id).subscribe({
          next: () => {
            this.showToast('success', 'Curso activado con éxito');
            this.loadCursos();
          },
          error: (error) => {
            this.showToast(
              'error',
              'Error al activar el curso: ' +
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
    this.filteredCursos = this.cursos.filter(
      (curso) =>
        (curso.nombre && curso.nombre.toLowerCase().includes(searchValue)) ||
        curso.fecha_publicacion.toLowerCase().includes(searchValue)
    );
  }

  onFileChangePrincipal(event: any): void {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
            this.imagenPrincipalPreview = e.target.result;
        };
        // Convertir a Blob y añadir al FormData
        this.cursoForm.patchValue({
            imagenPrincipal: file
        });
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
            this.cursoForm.patchValue({
                imagenesGenerales: [...this.cursoForm.get('imagenesGenerales')?.value || [], files[i]]
            });
        }
    }
}


  removeImagenGeneral(index: number): void {
    const imagenParaEliminar = this.imagenesGeneralesActuales[index];
    if (
      this.currentCursoId &&
      imagenParaEliminar.startsWith(this.baseImageUrl)
    ) {
      const relativePath = imagenParaEliminar.replace(this.baseImageUrl, '');
      this.cursoService
        .eliminarImagenGeneral(this.currentCursoId, relativePath)
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

  openImageModal(curso: Curso, type: 'principal' | 'generales'): void {
    this.isImageModalOpen = true;
    this.currentImageIndex = 0;
    if (type === 'principal') {
      this.modalTitle = 'Imagen Principal';
      this.allImages = [curso.imagen_principal!];
    } else {
      this.modalTitle = 'Imágenes Generales';
      this.allImages = curso.imagenes_generales || [];
    }
  }

  closeImageModal(): void {
    this.isImageModalOpen = false;
  }

  getCurrentImage(): string {
    return this.allImages[this.currentImageIndex];
  }

  nextImage(): void {
    this.currentImageIndex =
      (this.currentImageIndex + 1) % this.allImages.length;
  }

  getTotalImagesCount(): number {
    return this.allImages.length;
  }

  prevImage(): void {
    this.currentImageIndex =
      (this.currentImageIndex - 1 + this.allImages.length) %
      this.allImages.length;
  }

  switchTab(tab: 'active' | 'inactive'): void {
    if (tab === 'active') {
      this.filteredCursos = this.cursos.filter(
        (curso) => curso.activo !== false
      );
    } else {
      this.filteredCursos = this.papeleraCursos;
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.cursoForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.cursoForm.get(fieldName);
    if (field?.errors?.['required']) {
      return 'Este campo es requerido.';
    }
    if (field?.errors?.['maxlength']) {
      return `Máximo ${field.errors['maxlength'].requiredLength} caracteres.`;
    }
    return '';
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

  validateInput(event: KeyboardEvent) {
    const allowedKeys = /^[a-zA-Z0-9 ]*$/;
    const inputElement = event.target as HTMLInputElement;
  
    // Previene caracteres no permitidos
    if (!allowedKeys.test(event.key)) {
      event.preventDefault();
    }
  
    // Previene más de un espacio consecutivo
    const value = inputElement.value;
    if (event.key === ' ' && value.endsWith(' ')) {
      event.preventDefault();
    }
  }
}
