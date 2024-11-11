import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CarreraService, Carrera } from '../carrera.service';
import { DireccionService, Direccion } from '../../direccion.service';
import { NivelesEstudiosService, NivelesEstudios } from '../../niveles-estudios.service';
import { CampoEstudioService, CampoEstudio } from '../../campo-estudio.service';
import { CuatrimestreService } from '../../cuatrimestre.service';  // Importa el servicio de Cuatrimestres
import { AsignaturaService } from '../../asignatura.service';  // Importa el servicio de Asignaturas
import Swal from 'sweetalert2';
import { KeyValuePipe } from '@angular/common';
interface CarreraTemporal extends Carrera {
  imagenesGeneralesOriginales?: string[];
  imagenPrincipalOriginal?: string;
}


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
  Object = Object;
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
  cuatrimestresConAsignaturas: { [key: number]: { id: number, nombre: string }[] } = {};
  maxAsignaturasPorCuatrimestre: number = 0;
  cuatrimestresOrdenados: number[] = [];
  currentAsignaturaId?: number;
  isImageModalOpen = false;
  modalTitle = '';
  currentImageIndex = 0;
  allImages: string[] = [];
  baseImageUrl = 'http://localhost/paginaut/';




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
  getFullImageUrl(relativePath: string): string {
    if (!relativePath) {
      return ''; // Maneja el caso donde no haya una ruta válida
    }
    return this.baseImageUrl + relativePath;
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
  getImageUrl(relativePath: string): string {
    if (relativePath && relativePath.startsWith('../')) {
      return this.baseImageUrl + relativePath.substring(3);
    }
    return this.baseImageUrl + relativePath;
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

      // console.log("Enviando datos de carrera:", formData);

      this.carreraService.saveCarrera(formData, this.imagenPrincipal, this.imagenesGenerales).subscribe({
        next: (response: any) => {
          // console.log("Respuesta del servidor:", response);
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
          // console.error("Error al guardar la carrera:", error);
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
  findAsignaturaById(asignaturaId: number) {
    // console.log('Buscando asignatura con ID:', asignaturaId);
    for (const cuatrimestreNum of this.cuatrimestresOrdenados) {
      const asignaturas = this.cuatrimestresConAsignaturas[cuatrimestreNum];
      if (asignaturas) {
        const asignatura = asignaturas.find(a => a.id === asignaturaId);
        if (asignatura) {
          // console.log('Asignatura encontrada:', asignatura);
          return asignatura;
        }
      }
    }
    // console.log('Asignatura no encontrada');
    return null;
  }
  openImageModal(carrera: Carrera, type: 'principal' | 'generales'): void {
    this.closeAllModals();
    this.isImageModalOpen = true;
    this.currentImageIndex = 0;

    if (type === 'principal' && carrera.imagen_principal) {
      this.modalTitle = 'Imagen Principal';
      this.allImages = [this.getFullImageUrl(carrera.imagen_principal)];
    } else if (type === 'generales' && carrera.imagenes_generales) {
      this.modalTitle = 'Imágenes Generales';
      this.allImages = carrera.imagenes_generales.map(img => this.getFullImageUrl(img));
    }
  }

  closeImageModal(): void {
    this.isImageModalOpen = false;
    this.allImages = [];
  }
  getCurrentImage(): string {
    const currentImage = this.allImages[this.currentImageIndex];
    if (currentImage.startsWith('http')) {
      // Si la ruta ya incluye 'http', entonces no agregamos la base URL
      return currentImage;
    } else {
      // Si no la incluye, agregamos la base URL
      return this.baseImageUrl + currentImage;
    }
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

  closeAllModals(): void {
    this.isImageModalOpen = false;
    this.allImages = [];
  }

  onEditAsignatura(asignaturaId: number) {
    // console.log('Intentando editar asignatura con ID:', asignaturaId);

    const asignatura = this.findAsignaturaById(asignaturaId);

    if (!asignatura) {
      // console.error(`Asignatura con ID ${asignaturaId} no encontrada.`);
      this.showToast('error', 'Asignatura no encontrada.');
      return;
    }

    // console.log('Asignatura encontrada:', asignatura);

    this.asignaturaForm.patchValue({
      nombre: asignatura.nombre,
      cuatrimestre_id: this.getCuatrimestreId(asignaturaId)
    });

    this.currentAsignaturaId = asignaturaId;
    this.isMapaModalOpen = true;
  }


  getCuatrimestreId(asignaturaId: number): number | null {
    for (const cuatrimestreNum of this.cuatrimestresOrdenados) {
      const asignaturas = this.cuatrimestresConAsignaturas[cuatrimestreNum];
      if (asignaturas) {
        const asignatura = asignaturas.find(a => a.id === asignaturaId);
        if (asignatura) {
          return cuatrimestreNum; // Devuelve el número de cuatrimestre
        }
      }
    }
    return null; // Retorna null si no se encuentra el cuatrimestre
  }



// Método para eliminar una asignatura
onDeleteAsignatura(asignaturaId: number) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción no se puede deshacer',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      this.asignaturaService.deleteAsignatura(asignaturaId).subscribe({
        next: () => {
          this.showToast('success', 'Asignatura eliminada correctamente');
          this.cargarCuatrimestresConAsignaturas(this.selectedMapaCarrera?.id || 0);
        },
        error: (error) => {
          this.showToast('error', 'Error al eliminar la asignatura');
        }
      });
    }
  });
}




onSubmitAsignatura() {
  if (this.asignaturaForm.valid) {
    const cuatrimestreId = this.asignaturaForm.get('cuatrimestre_id')?.value;
    const nombreAsignatura = this.asignaturaForm.get('nombre')?.value;

    if (this.currentAsignaturaId !== undefined) {
      // Editar la asignatura existente
      this.asignaturaService.updateAsignatura(this.currentAsignaturaId, {
        nombre: nombreAsignatura,
        cuatrimestre_id: cuatrimestreId
      })
      .subscribe({
        next: () => {
          this.showToast('success', 'Asignatura actualizada correctamente');
          this.cargarCuatrimestresConAsignaturas(this.selectedMapaCarrera?.id || 0);
          this.closeMapaModal();
        },
        error: () => {
          this.showToast('error', 'Error al actualizar la asignatura');
        }
      });
    } else {
      // Crear una nueva asignatura
      const cuatrimestreData = {
        numero: cuatrimestreId,
        carrera_id: this.selectedMapaCarrera?.id
      };

      this.cuatrimestreService.saveCuatrimestre(cuatrimestreData).subscribe({
        next: (cuatrimestreResponse) => {
          const asignaturaData = {
            nombre: nombreAsignatura,
            cuatrimestre_id: cuatrimestreResponse.id
          };

          this.asignaturaService.saveAsignatura(asignaturaData).subscribe({
            next: () => {
              this.showToast('success', 'Asignatura agregada correctamente');
              this.cargarCuatrimestresConAsignaturas(this.selectedMapaCarrera?.id || 0);
              this.closeMapaModal();
            },
            error: () => {
              this.showToast('error', 'Error al guardar la asignatura');
            }
          });
        },
        error: (error) => {
          this.showToast('error', 'Error al crear el cuatrimestre');
        }
      });
    }
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

      // Limpiar las variables antes de cargar los datos de la nueva carrera
      this.cuatrimestresConAsignaturas = {};
      this.cuatrimestresOrdenados = [];
      this.maxAsignaturasPorCuatrimestre = 0;

      // Cargar los cuatrimestres y asignaturas si existen
      this.cargarCuatrimestresConAsignaturas(carrera.id);

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
        // console.error('Nivel de estudio no reconocido');
        return;
      }

      // Cargar cuatrimestres en base al rango determinado
      this.cuatrimestres = [];
      for (let i = cuatrimestreInicio; i <= cuatrimestreFin; i++) {
        this.cuatrimestres.push({ id: i, numero: i });
      }

      this.isMapaModalOpen = true;
    } else {
      // console.error("La carrera no tiene un ID válido o no se proporcionó una carrera.");
    }
  }

  cargarCuatrimestresConAsignaturas(carreraId: number) {
    this.cuatrimestreService.getCuatrimestresConAsignaturas(carreraId).subscribe({
      next: (response: any) => {
        this.cuatrimestresConAsignaturas = {};
        this.maxAsignaturasPorCuatrimestre = 0;

        if (Array.isArray(response) && response.length > 0) {
          response.forEach((cuatrimestre: any) => {
            if (!this.cuatrimestresConAsignaturas[cuatrimestre.numero]) {
              this.cuatrimestresConAsignaturas[cuatrimestre.numero] = [];
            }
            if (cuatrimestre.asignaturas && Array.isArray(cuatrimestre.asignaturas)) {
              cuatrimestre.asignaturas.forEach((asignatura: any) => {
                this.cuatrimestresConAsignaturas[cuatrimestre.numero].push({
                  id: asignatura.id,
                  nombre: asignatura.nombre
                });
              });
              this.maxAsignaturasPorCuatrimestre = Math.max(
                this.maxAsignaturasPorCuatrimestre,
                cuatrimestre.asignaturas.length
              );
            }
          });

          // Ordenar los cuatrimestres si existen asignaturas
          this.cuatrimestresOrdenados = Object.keys(this.cuatrimestresConAsignaturas)
            .map(Number)
            .sort((a, b) => a - b);
        }
      },
      error: (error: any) => {
        this.showToast('error', 'Error al cargar cuatrimestres y asignaturas.');
      }
    });
  }
  getAsignaturasPorFila(cuatrimestres: number[]) {
    const filas: any[] = [];
    const maxAsignaturasPorCuatrimestre = Math.max(...cuatrimestres.map(cuatrimestreNum => this.cuatrimestresConAsignaturas[cuatrimestreNum]?.length || 0));

    for (let i = 0; i < maxAsignaturasPorCuatrimestre; i++) {
      const fila: any = {};
      cuatrimestres.forEach(cuatrimestreNum => {
        fila[cuatrimestreNum] = this.cuatrimestresConAsignaturas[cuatrimestreNum]?.[i] || null;
      });
      filas.push(fila);
    }

    return filas;
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
