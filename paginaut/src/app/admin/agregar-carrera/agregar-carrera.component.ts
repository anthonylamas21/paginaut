import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CarreraService, Carrera } from '../carrera.service';
import { DireccionService, Direccion } from '../../direccion.service';
import { NivelesEstudiosService, NivelesEstudios } from '../../niveles-estudios.service';
import { CampoEstudioService, CampoEstudio } from '../../campo-estudio.service';
import { CuatrimestreService } from '../../cuatrimestre.service';  // Importa el servicio de Cuatrimestres
import { AsignaturaService } from '../../asignatura.service';  // Importa el servicio de Asignaturas
import Swal from 'sweetalert2';

class TooltipManager {
  static adjustTooltipPosition(button: HTMLElement, tooltip: HTMLElement): void {
    const buttonRect = button.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const preferredLeft = buttonRect.left - tooltipRect.width / 2 + buttonRect.width / 2;
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
  selector: 'app-agregar-carrera',
  templateUrl: './agregar-carrera.component.html',
  styleUrls: ['./agregar-carrera.component.css'],
})
export class AgregarCarreraComponent implements OnInit {
  carreraForm: FormGroup;
  asignaturaForm: FormGroup;  // Formulario para agregar asignaturas
  errorMessage: string = '';
  successMessage: string = '';
  isModalOpen: boolean = false;
  isMapaModalOpen: boolean = false;  // Para el modal del mapa cuatrimestral
  isViewModalOpen: boolean = false;
  carreras: Carrera[] = [];
  direcciones: Direccion[] = [];
  nivelesEstudios: NivelesEstudios[] = [];
  camposEstudio: CampoEstudio[] = [];
  cuatrimestres: any[] = [];  // Lista de cuatrimestres para el formulario
  filteredCarreras: Carrera[] = [];
  papeleraCarreras: Carrera[] = [];
  currentCarreraId?: number;
  currentCarrera?: Carrera;
  selectedCarrera?: Carrera;
  currentTab: 'active' | 'inactive' = 'active';
  imagenPrincipal?: File;
  imagenesGenerales: File[] = [];
  selectedMapaCarrera?: Carrera;  // Carrera seleccionada para el mapa cuatrimestral

  constructor(
    private fb: FormBuilder,
    private carreraService: CarreraService,
    private direccionService: DireccionService,
    private nivelesEstudiosService: NivelesEstudiosService,
    private campoEstudioService: CampoEstudioService,
    private cuatrimestreService: CuatrimestreService,  // Inyecta el servicio de Cuatrimestres
    private asignaturaService: AsignaturaService  // Inyecta el servicio de Asignaturas
  ) {
    this.carreraForm = this.fb.group({
      nombre_carrera: ['', [Validators.required, Validators.maxLength(100)]],
      perfil_profesional: ['', [Validators.maxLength(500)]],
      ocupacion_profesional: ['', [Validators.maxLength(500)]],
      direccion_id: ['', [Validators.required]],
      nivel_estudio_id: ['', [Validators.required]],
      campo_estudio_id: ['', [Validators.required]],
    });

    this.asignaturaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      cuatrimestre_id: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadCarreras();
    this.loadDirecciones();
    this.loadNivelesEstudios();
    this.loadCamposEstudio();
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

  onSubmit() {
    if (this.carreraForm.valid) {
      const formData: Carrera = {
        id: this.currentCarreraId,
        nombre_carrera: this.carreraForm.get('nombre_carrera')?.value,
        perfil_profesional: this.carreraForm.get('perfil_profesional')?.value,
        ocupacion_profesional: this.carreraForm.get('ocupacion_profesional')?.value,
        direccion_id: this.carreraForm.get('direccion_id')?.value,
        nivel_estudio_id: this.carreraForm.get('nivel_estudio_id')?.value,
        campo_estudio_id: this.carreraForm.get('campo_estudio_id')?.value,
        activo: true,
      };

      console.log("Enviando datos de carrera:", formData);

      this.carreraService.saveCarrera(formData, this.imagenPrincipal, this.imagenesGenerales).subscribe({
        next: (response: any) => {
          console.log("Respuesta del servidor:", response);
          if (response.id) {
            this.currentCarreraId = response.id; // Actualiza la ID de la carrera
          }
          this.showToast(
            'success',
            this.currentCarreraId
              ? 'Carrera actualizada correctamente'
              : 'Carrera agregada correctamente'
          );
          this.loadCarreras();
          this.resetForm();
          this.closeModal();
        },
        error: (error: any) => {
          console.error("Error al guardar la carrera:", error);
          this.showToast('error', error.message);
        },
      });
    } else {
      this.showToast(
        'warning',
        'Por favor, completa todos los campos requeridos.'
      );
    }
  }

  onSubmitAsignatura() {
    if (this.asignaturaForm.valid) {
      const formData = {
        nombre: this.asignaturaForm.get('nombre')?.value,
        cuatrimestre_id: this.asignaturaForm.get('cuatrimestre_id')?.value,
        carrera_id: this.selectedMapaCarrera?.id // Asegúrate de pasar el carrera_id
      };

      this.asignaturaService.saveAsignatura(formData).subscribe({
        next: (response) => {
          console.log("Asignatura guardada:", response);
          this.closeMapaModal();
          this.showToast('success', 'Asignatura agregada correctamente');
        },
        error: (error) => {
          console.error("Error al guardar la asignatura:", error);
          this.showToast('error', 'Error al guardar la asignatura');
        }
      });
    } else {
      this.showToast('warning', 'Por favor, completa todos los campos requeridos.');
    }
  }



  resetForm() {
    this.carreraForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
    this.currentCarreraId = undefined;
    this.currentCarrera = undefined;
    this.imagenPrincipal = undefined;
    this.imagenesGenerales = [];
  }

  openModal(carrera?: Carrera) {
    if (carrera) {
      this.currentCarreraId = carrera.id;
      this.carreraForm.patchValue({
        nombre_carrera: carrera.nombre_carrera,
        perfil_profesional: carrera.perfil_profesional,
        ocupacion_profesional: carrera.ocupacion_profesional,
        direccion_id: carrera.direccion_id,
        nivel_estudio_id: carrera.nivel_estudio_id,
        campo_estudio_id: carrera.campo_estudio_id,
      });
      this.imagenPrincipal = undefined; // Resetea las imágenes al abrir el modal
      this.imagenesGenerales = [];
    } else {
      this.resetForm();
    }
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  openMapaModal(carrera?: Carrera) {
    if (carrera && carrera.id !== undefined) {
      this.selectedMapaCarrera = carrera;

      // Determina el rango de cuatrimestres según el nivel de estudios
      let cuatrimestreInicio: number;
      let cuatrimestreFin: number;

      if (carrera.nivel_estudio_id === 1) {
        cuatrimestreInicio = 1;
        cuatrimestreFin = 6;
      } else if (carrera.nivel_estudio_id === 2 || carrera.nivel_estudio_id === 3) {
        cuatrimestreInicio = 7;
        cuatrimestreFin = 11;
      } else {
        console.error('Nivel de estudio no reconocido');
        return;
      }

      // Cargar cuatrimestres en base al rango determinado
      this.cuatrimestres = [];
      for (let i = cuatrimestreInicio; i <= cuatrimestreFin; i++) {
        this.cuatrimestres.push({ id: i, numero: i });
      }

      this.isMapaModalOpen = true;
    } else {
      console.error("La carrera no tiene un ID válido o no se proporcionó una carrera.");
    }
  }



  closeMapaModal() {
    this.isMapaModalOpen = false;
    this.asignaturaForm.reset();
  }

  openViewModal(carrera: Carrera) {
    this.selectedCarrera = carrera;
    this.isViewModalOpen = true;
  }

  closeViewModal() {
    this.isViewModalOpen = false;
  }

  loadCarreras() {
    this.carreraService.getCarreras().subscribe({
      next: (response: any) => {
        this.carreras = response.records;
        this.filterCarreras();
      },
      error: (error: any) => {
        this.showToast('error', error.message);
      },
    });
  }

  loadDirecciones() {
    this.direccionService.getDirecciones().subscribe({
      next: (response: any) => {
        this.direcciones = response.records;
      },
      error: (error: any) => {
        this.showToast('error', error.message);
      },
    });
  }

  loadNivelesEstudios() {
    this.nivelesEstudiosService.getNivelesEstudios().subscribe({
      next: (response: any) => {
        this.nivelesEstudios = response.records;
      },
      error: (error: any) => {
        this.showToast('error', error.message);
      },
    });
  }

  loadCamposEstudio() {
    this.campoEstudioService.getCampoEstudio().subscribe({
      next: (response: any) => {
        this.camposEstudio = response.records;
      },
      error: (error: any) => {
        this.showToast('error', error.message);
      },
    });
  }

  cargarCuatrimestres(carreraId: number) {
    this.cuatrimestreService.getCuatrimestresByCarrera(carreraId).subscribe({
      next: (cuatrimestres) => {
        this.cuatrimestres = cuatrimestres;
      },
      error: (err) => console.error(err)
    });
  }

  moveToTrash(id: number) {
    this.showConfirmDialog(
      '¿Estás seguro?',
      '¿Quieres enviar esta carrera a la papelera?',
      () => {
        this.carreraService.updateCarreraStatus(id, 'desactivar').subscribe({
          next: (response: any) => {
            this.showToast('success', 'Carrera enviada a la papelera');
            this.loadCarreras();
          },
          error: (error: any) => {
            this.showToast('error', error.message);
          },
        });
      }
    );
  }

  restoreCarrera(id: number) {
    this.showConfirmDialog(
      '¿Estás seguro?',
      '¿Quieres restaurar esta carrera?',
      () => {
        this.carreraService.updateCarreraStatus(id, 'activar').subscribe({
          next: (response: any) => {
            this.showToast('success', 'Carrera restaurada');
            this.loadCarreras();
          },
          error: (error: any) => {
            this.showToast('error', error.message);
          },
        });
      }
    );
  }


  deleteCarrera(id: number) {
    this.showConfirmDialog(
      '¿Estás seguro?',
      '¿Quieres eliminar esta carrera? Esta acción no se puede deshacer.',
      () => {
        this.carreraService.deleteCarrera(id).subscribe({
          next: (response: any) => {
            this.showToast('success', 'Carrera eliminada correctamente');
            this.loadCarreras();
          },
          error: (error: any) => {
            this.showToast('error', error.message);
          },
        });
      }
    );
  }

  filterCarreras() {
    const value = '';
    if (this.currentTab === 'active') {
      this.filteredCarreras = this.carreras.filter(
        (carrera) =>
          carrera.activo &&
          (carrera.nombre_carrera.toLowerCase().includes(value) ||
            (carrera.perfil_profesional &&
              carrera.perfil_profesional.toLowerCase().includes(value)) ||
            (carrera.ocupacion_profesional &&
              carrera.ocupacion_profesional.toLowerCase().includes(value)) ||
            (carrera.fecha_creacion && carrera.fecha_creacion.includes(value)))
      );
    } else {
      this.papeleraCarreras = this.carreras.filter(
        (carrera) =>
          !carrera.activo &&
          (carrera.nombre_carrera.toLowerCase().includes(value) ||
            (carrera.perfil_profesional &&
              carrera.perfil_profesional.toLowerCase().includes(value)) ||
            (carrera.ocupacion_profesional &&
              carrera.ocupacion_profesional.toLowerCase().includes(value)) ||
            (carrera.fecha_creacion && carrera.fecha_creacion.includes(value)))
      );
    }
  }

  switchTab(tab: 'active' | 'inactive') {
    this.currentTab = tab;
    this.filterCarreras();
  }

  mostrar(elemento: any): void {
    if (elemento.tagName.toLowerCase() === 'button') {
      const tooltipElement = elemento.querySelector('.hs-tooltip');
      if (tooltipElement) {
        tooltipElement.classList.toggle('show');
        const tooltipContent = tooltipElement.querySelector('.hs-tooltip-content');
        if (tooltipContent) {
          tooltipContent.classList.toggle('hidden');
          tooltipContent.classList.toggle('invisible');
          tooltipContent.classList.toggle('visible');
          TooltipManager.adjustTooltipPosition(elemento, tooltipContent);
        }
      }
    }
  }

  onFileChange(event: any, type: 'principal' | 'generales'): void {
    if (type === 'principal') {
      this.imagenPrincipal = event.target.files[0];
    } else if (type === 'generales') {
      this.imagenesGenerales = Array.from(event.target.files);
    }
  }

  private showToast(icon: 'success' | 'warning' | 'error' | 'info' | 'question', title: string): void {
    const Toast = Swal.mixin({
      toast: true,iconColor: '#008779',
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

  private showConfirmDialog(title: string, text: string, onConfirm: () => void): void {
    Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm();
      }
    });
  }
}
