import {
  Component,
  HostListener,
  OnInit,
  Renderer2,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ProfesorService, Profesor } from '../profesor.service';
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
  selector: 'app-agregar-profesor',
  templateUrl: './agregar-profesor.component.html',
  styleUrls: ['./agregar-profesor.component.css'],
})
export class AgregarProfesorComponent implements OnInit {
  profesorForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isModalOpen: boolean = false;
  isViewModalOpen: boolean = false;
  profesores: Profesor[] = [];
  filteredProfesores: Profesor[] = [];
  papeleraProfesores: Profesor[] = [];
  currentProfesorId?: number;
  currentProfesor?: Profesor;
  selectedProfesor?: Profesor;
  currentTab: 'active' | 'inactive' = 'active';
  fileToUpload: File | null = null;
  currentFileName: string = '';
  baseImageUrl = 'http://localhost/paginaut/';
  tipoProfesorError: string = '';

  constructor(
    private fb: FormBuilder,
    private profesorService: ProfesorService,
    public sanitizer: DomSanitizer,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef
  ) {
    this.profesorForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      apellido: ['', [Validators.required, Validators.maxLength(50)]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.maxLength(20)]],
      especialidad: ['', [Validators.required, Validators.maxLength(100)]],
      grado_academico: ['', [Validators.required, Validators.maxLength(100)]],
      experiencia: ['', [Validators.required]],
      foto: [''],
      tipoTiempoCompleto: [false],
      tipoAsignatura: [false],
      tipoCursos: [false],
    });
  }

  ngOnInit(): void {
    this.loadProfesores();
    this.setNavbarColor();
  }

  validateInput(event: KeyboardEvent) {
    const allowedKeys = /^[a-zA-Z0-9\s.,]*$/; // Permitir letras, números, espacios, puntos y comas
    if (!allowedKeys.test(event.key)) {
      event.preventDefault();
    }
  }

  onTipoProfesorChange(): void {
    const tipoTiempoCompleto =
      this.profesorForm.get('tipoTiempoCompleto')?.value;
    const tipoAsignatura = this.profesorForm.get('tipoAsignatura')?.value;

    if (tipoTiempoCompleto && tipoAsignatura) {
      this.tipoProfesorError =
        'No puedes seleccionar Tiempo Completo y Asignatura al mismo tiempo.';
    } else {
      this.tipoProfesorError = '';
    }
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

  onSubmit() {
    if (this.profesorForm.valid && !this.tipoProfesorError) {
      const formData: FormData = new FormData();
      formData.append('nombre', this.profesorForm.get('nombre')?.value);
      formData.append('apellido', this.profesorForm.get('apellido')?.value);
      formData.append('correo', this.profesorForm.get('correo')?.value);
      formData.append(
        'telefono',
        this.profesorForm.get('telefono')?.value || ''
      );
      formData.append(
        'especialidad',
        this.profesorForm.get('especialidad')?.value || ''
      );
      formData.append(
        'grado_academico',
        this.profesorForm.get('grado_academico')?.value || ''
      );
      formData.append(
        'experiencia',
        this.profesorForm.get('experiencia')?.value || ''
      );
      if (this.fileToUpload) {
        formData.append('foto', this.fileToUpload, this.fileToUpload.name);
      } else {
        formData.append('foto', this.currentFileName);
      }

      if (this.currentProfesorId) {
        formData.append('id', this.currentProfesorId.toString());
        this.profesorService.updateProfesor(formData).subscribe({
          next: (response: any) => {
            this.assignTipoProfesor(this.currentProfesorId!);
            this.showToast('success', 'Profesor actualizado correctamente');
            this.loadProfesores();
            this.resetForm();
            this.closeModal();
          },
          error: (error: any) => {
            this.showToast('error', error.message);
          },
        });
      } else {
        this.profesorService.addProfesor(formData).subscribe({
          next: (response: any) => {
            const profesor_id = response.id;
            this.assignTipoProfesor(profesor_id);
            this.showToast('success', 'Profesor agregado correctamente');
            this.loadProfesores();
            this.resetForm();
            this.closeModal();
          },
          error: (error: any) => {
            this.showToast('error', error.message);
          },
        });
      }
    } else {
      this.showToast(
        'warning',
        'Por favor, completa todos los campos requeridos.'
      );
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.fileToUpload = file;
    } else {
      this.profesorForm.get('foto')?.setErrors({ invalidFileType: true });
      this.showToast('error', 'Solo se permiten archivos de imagen.');
      this.fileToUpload = null;
    }
  }

  resetForm() {
    this.profesorForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
    this.currentProfesorId = undefined;
    this.currentProfesor = undefined;
    this.currentFileName = '';
    this.fileToUpload = null;
  }

  openModal(profesor?: Profesor) {
    if (profesor) {
      this.currentProfesorId = profesor.id;
      this.currentProfesor = profesor;
      this.currentFileName = profesor.foto ?? '';
      this.profesorForm.patchValue({
        nombre: profesor.nombre ?? '',
        apellido: profesor.apellido ?? '',
        correo: profesor.correo ?? '',
        telefono: profesor.telefono ?? '',
        especialidad: profesor.especialidad ?? '',
        grado_academico: profesor.grado_academico ?? '',
        experiencia: profesor.experiencia ?? '',
        tipoTiempoCompleto: profesor.tipo === 'Tiempo Completo',
        tipoAsignatura: profesor.tipo === 'Asignatura',
        tipoCursos: profesor.tipo === 'Cursos',
      });
    } else {
      this.resetForm();
    }
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  openViewModal(profesor: Profesor) {
    this.selectedProfesor = profesor;
    this.isViewModalOpen = true;
  }

  closeViewModal() {
    this.isViewModalOpen = false;
  }

  loadProfesores() {
    this.profesorService.getProfesores().subscribe({
      next: (response: any) => {
        this.profesores = response.records;
        this.filterProfesores();
      },
      error: (error: any) => {
        this.showToast('error', error.message);
      },
    });
  }

  deleteProfesor(id: number) {
    this.showConfirmDialog(
      'Eliminar profesor',
      'Esta acción eliminará permanentemente al profesor seleccionado. No podrás recuperarlo. ¿Estás seguro de que deseas continuar?',
      () => {
        this.profesorService.deleteProfesor(id).subscribe({
          next: (response: any) => {
            this.showToast('success', 'Profesor eliminado correctamente');
            this.loadProfesores();
          },
          error: (error: any) => {
            this.showToast('error', error.message);
          },
        });
      }
    );
  }

  moveToTrash(id: number) {
    this.showConfirmDialog(
      'Mover a papelera',
      'Este profesor será movido a la papelera. Podrás restaurarlo más tarde si lo deseas. ¿Quieres mover este profesor a la papelera?',
      () => {
        const formData: FormData = new FormData();
        formData.append('id', id.toString());
        formData.append('activo', 'false');

        this.profesorService.updateProfesor(formData).subscribe({
          next: (response: any) => {
            this.showToast(
              'success',
              'Profesor movido a la papelera correctamente'
            );
            this.loadProfesores();
          },
          error: (error: any) => {
            this.showToast('error', error.message);
          },
        });
      }
    );
  }

  activateProfesor(id: number) {
    const profesorToUpdate = this.profesores.find(
      (profesor) => profesor.id === id
    );
    if (profesorToUpdate) {
      this.showConfirmDialog(
        'Reactivar profesor',
        '¿Quieres reactivar este profesor?',
        () => {
          const formData: FormData = new FormData();
          formData.append('id', profesorToUpdate.id!.toString());
          formData.append('nombre', profesorToUpdate.nombre ?? '');
          formData.append('apellido', profesorToUpdate.apellido ?? '');
          formData.append('correo', profesorToUpdate.correo ?? '');
          formData.append('telefono', profesorToUpdate.telefono ?? '');
          formData.append('especialidad', profesorToUpdate.especialidad ?? '');
          formData.append(
            'grado_academico',
            profesorToUpdate.grado_academico ?? ''
          );
          formData.append('experiencia', profesorToUpdate.experiencia ?? '');
          formData.append('activo', 'true');

          this.profesorService.updateProfesor(formData).subscribe({
            next: (response: any) => {
              this.showToast('success', 'Profesor reactivado correctamente');
              this.loadProfesores();
            },
            error: (error: any) => {
              this.showToast('error', error.message);
            },
          });
        }
      );
    }
  }

  switchTab(tab: 'active' | 'inactive') {
    this.currentTab = tab;
    this.filterProfesores();
  }

  filterProfesores() {
    if (this.currentTab === 'active') {
      this.filteredProfesores = this.profesores.filter(
        (profesor) => profesor.activo
      );
    } else {
      this.papeleraProfesores = this.profesores.filter(
        (profesor) => !profesor.activo
      );
    }
  }

  filterGlobal(event: Event) {
    const value = (event.target as HTMLInputElement).value.toLowerCase();
    if (this.currentTab === 'active') {
      this.filteredProfesores = this.profesores.filter(
        (profesor) =>
          profesor.activo &&
          (profesor.nombre.toLowerCase().includes(value) ||
            profesor.apellido.toLowerCase().includes(value) ||
            profesor.correo.toLowerCase().includes(value) ||
            (profesor.telefono?.toLowerCase().includes(value) ?? false))
      );
    } else {
      this.papeleraProfesores = this.profesores.filter(
        (profesor) =>
          !profesor.activo &&
          (profesor.nombre.toLowerCase().includes(value) ||
            profesor.apellido.toLowerCase().includes(value) ||
            profesor.correo.toLowerCase().includes(value) ||
            (profesor.telefono?.toLowerCase().includes(value) ?? false))
      );
    }
  }

  private assignTipoProfesor(profesor_id: number) {
    if (this.profesorForm.get('tipoTiempoCompleto')?.value) {
      this.profesorService
        .addTipoProfesor({ profesor_id, tipo_id: 1 })
        .subscribe();
    }
    if (this.profesorForm.get('tipoAsignatura')?.value) {
      this.profesorService
        .addTipoProfesor({ profesor_id, tipo_id: 2 })
        .subscribe();
    }
    if (this.profesorForm.get('tipoCursos')?.value) {
      this.profesorService
        .addTipoProfesor({ profesor_id, tipo_id: 3 })
        .subscribe();
    }
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

  private showToast(
    icon: 'success' | 'warning' | 'error' | 'info' | 'question',
    title: string
  ): void {
    const Toast = Swal.mixin({
      toast: true,
      iconColor: '#008779',
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
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
      reverseButtons: true,
      focusCancel: true,
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar',
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
}
