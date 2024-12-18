import { Component, OnInit, HostListener } from '@angular/core';
import { CursoService, Curso } from '../../cursoService/curso.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { BASEIMAGEN } from '../../constans';

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
  selector: 'app-agregar-curso',
  templateUrl: './agregar-curso.component.html',
  styleUrls: ['./agregar-curso.component.css'],
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
  baseImageUrl = BASEIMAGEN+'/';
  imagenPrincipalPreview: string | ArrayBuffer | null = null;
  imagenesGeneralesActuales: string[] = [];
  isImageModalOpen = false;
  modalTitle = '';
  currentImageIndex = 0;
  allImages: string[] = [];
  profesores: any[] = [];
  selectedProfesores: Set<number> = new Set();
  imagenesGeneralesAEliminar: string[] = [];

  constructor(private cursoService: CursoService, private fb: FormBuilder) {
    this.cursoForm = this.fb.group({
      nombre: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.minLength(5),
          Validators.pattern(/^[a-zA-ZÀ-ÿ0-9\s]+$/),
        ],
      ],
      descripcion: [
        '',
        [
          Validators.required,
          Validators.maxLength(2000),
          Validators.minLength(5),
        ],
      ],
      activo: [true],
      imagenPrincipal: [null], // Inicia sin Validators.required
      imagenesGenerales: [[]],
    });
  }

  ngOnInit(): void {
    this.loadCursos();
    this.loadProfesores();
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
      nabvar.classList.add('bg-primary-color');
    }
  }

  loadProfesores(): void {
    this.cursoService.ObtenerProfesoresActivos().subscribe(
      (res) => {
        this.profesores = res.records;
      },
      (err) => {
        // console.error('Error al cargar profesores:', err);
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
        this.cursos = response.records.map((curso: Curso) => {
          // Formatear las fechas antes de devolver el objeto
          return this.addFormattedDate(curso);
        }).map((curso) => ({
          ...curso,
          titulo: curso.nombre,
          imagen_principal: this.getImageUrl(curso.imagen_principal || ''),
          imagenes_generales: (curso.imagenes_generales || []).map((img: string) => this.getImageUrl(img)),
        }));
        this.filterCursos();
      }
    });
  }
  
  private addFormattedDate(curso: Curso): Curso & { fecha_string: string} {
    return {
      ...curso,
      // Pasamos la fecha como string, que luego se formatea correctamente
      fecha_string: curso.fecha_creacion 
        ? this.formatDateString(curso.fecha_creacion) 
        : 'Fecha no disponible',
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

  getImageUrl(relativePath: string): string {
    return this.baseImageUrl + relativePath;
  }

  filterCursos(): void {
    this.filteredCursos = this.cursos.filter((curso) => curso.activo !== false);
    this.papeleraCursos = this.cursos.filter((curso) => curso.activo === false);
  }

  filterGlobal(event: any): void {
    const searchValue = event.target.value.toLowerCase();
    this.filteredCursos = this.cursos.filter(
      (curso) =>
        curso.activo === true &&
        (curso.nombre.toLowerCase().includes(searchValue) ||
          curso.descripcion.toLowerCase().includes(searchValue) ||
          (curso.fecha_string?.toLowerCase().includes(searchValue) ??
            false))
    );
  }

  filterGlobalInactive(event: any): void {
    const searchValue = event.target.value.toLowerCase();
    this.papeleraCursos = this.cursos.filter(
      (curso) =>
        curso.activo === false &&
        (curso.nombre.toLowerCase().includes(searchValue) ||
          curso.descripcion.toLowerCase().includes(searchValue) ||
          (curso.fecha_string?.toLowerCase().includes(searchValue) ??
            false))
    );
  }

  openModal(curso?: Curso): void {
    this.isModalOpen = true;
    if (curso) {
      this.currentCursoId = curso.id!;
      this.cursoForm.patchValue(curso);
      this.imagenPrincipalPreview = curso.imagen_principal || null;
      this.imagenesGeneralesActuales = curso.imagenes_generales || [];

      this.selectedProfesores.clear();
      this.cursoService.obtenerProfesoresPorCurso(curso.id!).subscribe({
        next: (response) => {
          response.profesores.forEach((profesor: any) => {
            this.selectedProfesores.add(profesor.profesor_id);
          });
        },
        error: (error) => {
          // console.error('Error al cargar los profesores del curso:', error);
        },
      });
    } else {
      this.currentCursoId = null;
      this.cursoForm.reset({ activo: true });
      this.imagenPrincipalPreview = null;
      this.imagenesGeneralesActuales = [];
      this.selectedProfesores.clear();
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
        imagenesGenerales.forEach((file: any) => {
          formData.append('imagenes_generales[]', file);
        });
      }

      if (this.imagenesGeneralesAEliminar.length > 0) {
        formData.append(
          'imagenes_a_eliminar',
          JSON.stringify(this.imagenesGeneralesAEliminar)
        );
      }

      formData.append(
        'profesores',
        JSON.stringify(Array.from(this.selectedProfesores))
      );

      if (this.currentCursoId) {
        formData.append('id', this.currentCursoId.toString());
        this.cursoService
          .actualizarCurso(formData, this.currentCursoId)
          .subscribe({
            next: (response) => {
              this.showToast('success', 'Curso actualizado con éxito');
              this.closeModal();
              this.loadCursos();
            },
            error: (error) => {
              // console.error('Error al procesar el curso:', error);
              this.showToast('error', 'Error al procesar el curso');
            },
            complete: () => {
              this.isLoading = false;
            },
          });
      } else {
        this.cursoService.crearCursoConProfesores(formData).subscribe({
          next: (response) => {
            this.showToast('success', 'Curso creado con éxito');
            this.closeModal();
            this.loadCursos();
          },
          error: (error) => {
            // console.error('Error al procesar el curso:', error);
            this.showToast('error', 'Error al procesar el curso');
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

  eliminarProfesores(cursoId: number): void {
    this.cursoService.eliminarProfesoresPorCurso(cursoId).subscribe({
      next: () => {
        this.guardarProfesores(cursoId);
      },
      error: (error) => {
        // console.error('Error al eliminar los profesores:', error);
        this.showToast('error', 'Error al eliminar los profesores');
      },
    });
  }

  guardarProfesores(cursoId: number): void {
    if (this.selectedProfesores.size > 0) {
      const profesoresData = Array.from(this.selectedProfesores).map(
        (profesorId) => ({
          curso_id: cursoId,
          profesor_id: profesorId,
          activo: true,
        })
      );

      this.cursoService.asignarProfesores(profesoresData).subscribe({
        next: (response) => {
          console.log('Profesores asignados con éxito:', response);
        },
        error: (error) => {
          // console.error('Error al asignar los profesores:', error);
          this.showToast('error', 'Error al asignar los profesores');
        },
      });
    }
  }

  getProfesoresArray(): { profesor_id: number; curso_id: number }[] {
    return Array.from(this.selectedProfesores).map((profesorId) => ({
      profesor_id: profesorId,
      curso_id: this.currentCursoId || 0,
    }));
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
            // console.error('Error:', error);
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
            // console.error('Error:', error);
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
            // console.error('Error:', error);
          },
        });
      }
    );
  }

  onFileChangePrincipal(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagenPrincipalPreview = e.target.result;
      };
      this.cursoForm.patchValue({
        imagenPrincipal: file,
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
          imagenesGenerales: [
            ...(this.cursoForm.get('imagenesGenerales')?.value || []),
            files[i],
          ],
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
      this.imagenesGeneralesAEliminar.push(relativePath);
    }

    this.imagenesGeneralesActuales.splice(index, 1);

    const files = this.cursoForm.get('imagenesGenerales')?.value;
    if (files) {
      const updatedFiles = Array.from(files);
      updatedFiles.splice(index, 1);
      this.cursoForm.patchValue({ imagenesGenerales: updatedFiles });
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

  validateInput(event: KeyboardEvent) {
    const allowedKeys = /^[a-zA-Z0-9 ]*$/;
    const inputElement = event.target as HTMLInputElement;

    if (!allowedKeys.test(event.key)) {
      event.preventDefault();
    }

    const value = inputElement.value;
    if (event.key === ' ' && value.endsWith(' ')) {
      event.preventDefault();
    }
  }

  tooltipVisible = false;
  selectedProfesor: any;
  tooltipStyles = {};

  showTooltip(profesorId: number) {
    this.selectedProfesor = this.profesores.find(
      (profesor) => profesor.id === profesorId
    );
    this.tooltipVisible = true;
  }

  hideTooltip() {
    this.tooltipVisible = false;
  }
}
