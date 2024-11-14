import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { ConvocatoriaService, Convocatoria } from '../../convocatoria.service';
import { CursoService, Curso } from '../../cursoService/curso.service';
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

interface ConvocatoriaTemporal extends Convocatoria {
  imagenesGeneralesOriginales?: string[];
  archivosOriginales?: any[];
  imagenPrincipalOriginal?: string;
}

@Component({
  selector: 'app-convocatoria',
  templateUrl: './convocatoria.component.html',
  styleUrls: ['./convocatoria.component.css'],
})
export class ConvocatoriaComponent implements OnInit, OnDestroy {
  convocatorias: Convocatoria[] = [];
  filteredConvocatorias: Convocatoria[] = [];
  papeleraConvocatorias: Convocatoria[] = [];
  cursos: Curso[] = [];
  convocatoriaForm: FormGroup;
  isModalOpen = false;
  currentConvocatoriaId: number | null = null;
  isLoading = false;
  responseMessage = '';
  baseImageUrl = BASEIMAGEN+'/';
  imagenPrincipalPreview: string | ArrayBuffer | null = null;
  imagenesGeneralesActuales: string[] = [];
  archivosActuales: any[] = [];
  isImageModalOpen = false;
  isArchivoModalOpen = false;
  modalTitle = '';
  currentImageIndex = 0;
  allImages: string[] = [];
  imagenesParaEliminar: string[] = [];
  archivosParaEliminar: string[] = [];
  convocatoriaTemporal: ConvocatoriaTemporal | null = null;
  minDate: string;
  minTimeInicio: string;
  minTimeFin: string;
  timeZone: string = 'America/Mazatlan';
  private unsubscribe$ = new Subject<void>();

  constructor(
    private convocatoriaService: ConvocatoriaService,
    private cursoService: CursoService,
    private fb: FormBuilder
  ) {
    this.minDate = this.getTodayDate();
    this.minTimeInicio = this.getCurrentTime();
    this.minTimeFin = this.minTimeInicio;
    this.convocatoriaForm = this.fb.group({
      titulo: ['',[ soloLetras(true),Validators.required, Validators.minLength(15), Validators.maxLength(150)]],
      descripcion: [ '',[ soloLetrasConPuntuacion(true),Validators.required, Validators.minLength(15), Validators.maxLength(2000)]],
      activo: [true],
      lugar: ['', [soloLetrasConPuntuacion(true), Validators.required, Validators.minLength(5), Validators.maxLength(150)]],
      fecha_inicio: ['', [this.fechaHoraValidator(), Validators.required]],
      fecha_fin: ['', [this.fechaHoraValidator(), Validators.required]],
      hora_inicio: ['', [this.fechaHoraValidator(), Validators.required]],
      hora_fin: ['', [this.fechaHoraValidator(), Validators.required]],
      es_curso: [null, Validators.required],
      curso_id: [null],
      imagen_principal: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadConvocatorias();
    this.loadCursos();
    this.setupDateTimeValidation();
    this.setNavbarColor();

    this.convocatoriaForm
      .get('es_curso')
      ?.valueChanges.pipe(takeUntil(this.unsubscribe$))
      .subscribe((value) => {
        if (value === true) {
          this.convocatoriaForm
            .get('curso_id')
            ?.setValidators([Validators.required]);
          this.convocatoriaForm.get('curso_id')?.updateValueAndValidity();
        } else {
          this.convocatoriaForm.get('curso_id')?.clearValidators();
          this.convocatoriaForm.get('curso_id')?.setValue(null);
          this.convocatoriaForm.get('curso_id')?.updateValueAndValidity();
        }
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
      nabvar.classList.add('bg-[#043D3D]');
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadCursos(): void {
    this.cursoService.getCursos().subscribe({
      next: (cursos: Curso[]) => {
        this.cursos = cursos;
      },
      error: (error) => {
        // console.error('Error al cargar los cursos:', error);
        this.showToast('error', 'Error al cargar los cursos');
      },
    });
  }

  loadConvocatorias(): void {
    this.convocatoriaService.obtenerConvocatorias().subscribe({
      next: (response) => {
        console.log(response);
        this.convocatorias = response.records.map((convocatoria: Convocatoria) => {
          // Aquí se formatean las fechas antes de devolver el objeto
          return this.addFormattedDate(convocatoria);
        }).map((convocatoria: Convocatoria) => ({
          ...convocatoria,
          imagen_principal: this.getImageUrl(convocatoria.imagen_principal || ''),
          imagenes_generales: (convocatoria.imagenes_generales || []).map((img: string) => this.getImageUrl(img)),
        }));
        this.filterConvocatorias();
      }
    });
  }
  
  private addFormattedDate(convocatoria: Convocatoria): Convocatoria & { fecha_string: string, horario_string: string} {
    return {
      ...convocatoria,
      // Pasamos la fecha como string, que luego se formatea correctamente
      fecha_string: this.formatDateString(convocatoria.fecha_inicio) +' - '+ this.formatDateString(convocatoria.fecha_fin),
      horario_string: this.formatHorarioString(convocatoria.hora_inicio) +' - '+ this.formatHorarioString(convocatoria.hora_fin),
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

  filterConvocatorias(): void {
    this.filteredConvocatorias = this.convocatorias.filter(
      (convocatoria) => convocatoria.activo !== false
    );
    this.papeleraConvocatorias = this.convocatorias.filter(
      (convocatoria) => convocatoria.activo === false
    );
  }

  openModal(convocatoria?: Convocatoria): void {
    this.isModalOpen = true;
    if (convocatoria) {
      this.currentConvocatoriaId = convocatoria.id!;

      const fechaInicio = convocatoria.fecha_inicio
        ? this.formatDate(new Date(convocatoria.fecha_inicio))
        : '';
      const fechaFin = convocatoria.fecha_fin
        ? this.formatDate(new Date(convocatoria.fecha_fin))
        : '';

      this.convocatoriaForm.patchValue({
        ...convocatoria,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        es_curso: convocatoria.es_curso || false,
        curso_id: convocatoria.curso_id || null,
      });

      this.imagenPrincipalPreview = convocatoria.imagen_principal || null;
      this.imagenesGeneralesActuales = [
        ...(convocatoria.imagenes_generales || []),
      ];
      this.archivosActuales = [...(convocatoria.archivos || [])];
    } else {
      this.currentConvocatoriaId = null;
      this.convocatoriaTemporal = null;
      this.convocatoriaForm.reset({ activo: true });
      this.imagenPrincipalPreview = null;
      this.imagenesGeneralesActuales = [];
      this.archivosActuales = [];
    }
    this.clearFileInputs();
  }

  closeModal(): void {
    if (this.convocatoriaTemporal) {
      const convocatoriaOriginal = this.convocatorias.find(
        (e) => e.id === this.currentConvocatoriaId
      );
      if (convocatoriaOriginal) {
        convocatoriaOriginal.imagen_principal =
          this.convocatoriaTemporal.imagenPrincipalOriginal;
        convocatoriaOriginal.imagenes_generales =
          this.convocatoriaTemporal.imagenesGeneralesOriginales;
        convocatoriaOriginal.archivos = this.convocatoriaTemporal.archivosOriginales;
      }
    }

    this.isModalOpen = false;
    this.convocatoriaForm.reset();
    this.currentConvocatoriaId = null;
    this.convocatoriaTemporal = null;
    this.imagenPrincipalPreview = null;
    this.imagenesGeneralesActuales = [];
    this.archivosActuales = [];
    this.imagenesParaEliminar = [];
    this.archivosParaEliminar = [];
    this.clearFileInputs();
  }

  clearFileInputs(): void {
    const imagenPrincipalInput = document.getElementById(
      'imagenPrincipal'
    ) as HTMLInputElement;
    const imagenesGeneralesInput = document.getElementById(
      'imagenesGenerales'
    ) as HTMLInputElement;
    const archivosInput = document.getElementById('archivos') as HTMLInputElement;
    if (imagenPrincipalInput) {
      imagenPrincipalInput.value = '';
    }
    if (imagenesGeneralesInput) {
      imagenesGeneralesInput.value = '';
    }
    if (archivosInput) {
      archivosInput.value = '';
    }
  }

  onSubmit(): void {
    if (this.convocatoriaForm.valid) {
      this.isLoading = true;
      const convocatoriaData: Convocatoria = {
        ...this.convocatoriaForm.value,
        id: this.currentConvocatoriaId,
        imagen_principal: this.imagenPrincipalPreview as string,
        imagenes_generales: this.imagenesGeneralesActuales,
        archivos: this.archivosActuales,
        es_curso: this.convocatoriaForm.get('es_curso')?.value,
        curso_id: this.convocatoriaForm.get('curso_id')?.value,
      };

      const imagenPrincipalInput = document.getElementById(
        'imagenPrincipal'
      ) as HTMLInputElement;
      const imagenPrincipal = imagenPrincipalInput.files?.[0];
      const imagenesGeneralesInput = document.getElementById(
        'imagenesGenerales'
      ) as HTMLInputElement;
      const imagenesGenerales = imagenesGeneralesInput.files;
      const archivosInput = document.getElementById('archivos') as HTMLInputElement;
      const archivos = archivosInput.files;

      if (this.currentConvocatoriaId) {
        const deleteImagenesPromises: Promise<any>[] = this.imagenesParaEliminar.map(
          (ruta) =>
            this.convocatoriaService
              .eliminarImagenGeneral(this.currentConvocatoriaId!, ruta)
              .toPromise()
        );

        const deleteArchivosPromises: Promise<any>[] = this.archivosParaEliminar.map(
          (ruta) =>
            this.convocatoriaService
              .eliminarArchivo(this.currentConvocatoriaId!, ruta)
              .toPromise()
        );

        Promise.all([...deleteImagenesPromises, ...deleteArchivosPromises])
          .then(() => {
            return this.convocatoriaService
              .actualizarConvocatoria(
                convocatoriaData,
                imagenPrincipal,
                imagenesGenerales ? Array.from(imagenesGenerales) : undefined,
                archivos ? Array.from(archivos) : undefined
              )
              .toPromise();
          })
          .then(() => {
            this.showToast('success', 'Convocatoria actualizada con éxito');
            this.closeModal();
            this.loadConvocatorias();
          })
          .catch((error) => {
            // console.error('Error al actualizar la convocatoria:', error);
            this.showToast(
              'error',
              'Error al actualizar la convocatoria: ' +
                (error.error?.message || error.message)
            );
          })
          .finally(() => {
            this.isLoading = false;
            this.imagenesParaEliminar = [];
            this.archivosParaEliminar = [];
          });
      } else {
        this.convocatoriaService
          .crearConvocatoria(
            convocatoriaData,
            imagenPrincipal,
            imagenesGenerales ? Array.from(imagenesGenerales) : undefined,
            archivos ? Array.from(archivos) : undefined
          )
          .subscribe({
            next: (response) => {
              this.showToast('success', 'Convocatoria creada con éxito');
              this.closeModal();
              this.loadConvocatorias();
            },
            error: (error) => {
              // console.error('Error al crear la convocatoria:', error);
              this.showToast(
                'error',
                'Error al crear la convocatoria: ' +
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
      Object.keys(this.convocatoriaForm.controls).forEach((key) => {
        const control = this.convocatoriaForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  isFormValid(): boolean {
    return this.convocatoriaForm.valid;
  }

  confirmDeleteConvocatoria(id: number): void {
    this.showConfirmDialog(
      '¿Estás seguro?',
      '¿Quieres eliminar esta convocatoria? Esta acción no se puede deshacer.',
      () => {
        this.convocatoriaService.eliminarConvocatoria(id).subscribe({
          next: () => {
            this.showToast('success', 'Convocatoria eliminada con éxito');
            this.loadConvocatorias();
          },
          error: (error) => {
            this.showToast(
              'error',
              'Error al eliminar la convocatoria: ' +
                (error.error?.message || error.message)
            );
            // console.error('Error:', error);
          },
        });
      }
    );
  }

  desactivarConvocatoria(id: number): void {
    this.showConfirmDialog(
      '¿Estás seguro?',
      '¿Quieres desactivar esta convocatoria? No será visible para los usuarios.',
      () => {
        this.convocatoriaService.desactivarConvocatoria(id).subscribe({
          next: () => {
            this.showToast('success', 'Convocatoria desactivada con éxito');
            this.loadConvocatorias();
          },
          error: (error) => {
            this.showToast(
              'error',
              'Error al desactivar la convocatoria: ' +
                (error.error?.message || error.message)
            );
            // console.error('Error:', error);
          },
        });
      }
    );
  }

  activarConvocatoria(id: number): void {
    this.showConfirmDialog(
      '¿Estás seguro?',
      '¿Quieres activar esta convocatoria? Será visible para los usuarios.',
      () => {
        this.convocatoriaService.activarConvocatoria(id).subscribe({
          next: () => {
            this.showToast('success', 'Convocatoria activada con éxito');
            this.loadConvocatorias();
          },
          error: (error) => {
            this.showToast(
              'error',
              'Error al activar la convocatoria: ' +
                (error.error?.message || error.message)
            );
            // console.error('Error:', error);
          },
        });
      }
    );
  }

  filterGlobal(event: any): void {
    const searchValue = event.target.value.toLowerCase();
    this.filteredConvocatorias = this.convocatorias.filter((convocatoria) => {
      // Filtrar por convocatorias activas (suponiendo que tienes una propiedad "activo")
      return convocatoria.activo && (
        (convocatoria.titulo?.toLowerCase().includes(searchValue) || '') ||
        (convocatoria.descripcion?.toLowerCase().includes(searchValue) || '') ||
        (convocatoria.lugar?.toLowerCase().includes(searchValue) || '') ||
        (convocatoria.fecha_string?.toLowerCase().includes(searchValue) || '') ||
        (convocatoria.horario_string?.toLowerCase().includes(searchValue) || '')
      );
    });
  } 
  
  filterGlobalInactive(event: any): void {
    const searchValue = event.target.value.toLowerCase();
    this.papeleraConvocatorias = this.convocatorias.filter((convocatoria) => {
      // Filtrar por convocatorias inactivas (suponiendo que tienes una propiedad "activo" que es true/false)
      return !convocatoria.activo && (
        (convocatoria.titulo?.toLowerCase().includes(searchValue) || '') ||
        (convocatoria.descripcion?.toLowerCase().includes(searchValue) || '') ||
        (convocatoria.lugar?.toLowerCase().includes(searchValue) || '') ||
        (convocatoria.fecha_string?.toLowerCase().includes(searchValue) || '') ||
        (convocatoria.horario_string?.toLowerCase().includes(searchValue) || '')
      );
    });
  }
  
  onFileChangePrincipal(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagenPrincipalPreview = e.target.result;
        this.convocatoriaForm.get('imagen_principal')?.setValue(file);
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

  onFileChangeArchivos(event: any): void {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        this.archivosActuales.push(files[i]);
      }
    }
  }

  removeImagenGeneral(index: number): void {
    const imagenParaEliminar = this.imagenesGeneralesActuales[index];
    if (
      this.currentConvocatoriaId &&
      imagenParaEliminar.startsWith(this.baseImageUrl)
    ) {
      const relativePath = imagenParaEliminar.replace(this.baseImageUrl, '');
      this.imagenesParaEliminar.push(relativePath);
    }
    this.imagenesGeneralesActuales.splice(index, 1);
  }

  removeArchivo(index: number): void {
    const archivoParaEliminar = this.archivosActuales[index];
    if (this.currentConvocatoriaId && archivoParaEliminar.ruta_archivo) {
      const relativePath = archivoParaEliminar.ruta_archivo.replace(
        this.baseImageUrl,
        ''
      );
      this.archivosParaEliminar.push(relativePath);
    }
    this.archivosActuales.splice(index, 1);
  }

  getCurrentImage(): string {
    return this.allImages[this.currentImageIndex];
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
      this.filteredConvocatorias = this.convocatorias.filter(
        (convocatoria) => convocatoria.activo !== false
      );
    } else {
      this.filteredConvocatorias = this.papeleraConvocatorias;
    }
  }

  fechaHoraValidator(): ValidatorFn {
    return (group: AbstractControl): { [key: string]: any } | null => {
      const fechaInicio = group.get('fecha_inicio')?.value;
      const fechaFin = group.get('fecha_fin')?.value;
      const horaInicio = group.get('hora_inicio')?.value;
      const horaFin = group.get('hora_fin')?.value;

      if (fechaInicio && fechaFin && horaInicio && horaFin) {
        const fechaHoraInicio = new Date(`${fechaInicio}T${horaInicio}`);
        const fechaHoraFin = new Date(`${fechaFin}T${horaFin}`);

        if (fechaHoraFin <= fechaHoraInicio) {
          return { fechaHoraInvalida: true };
        }
      }

      return null;
    };
  }

  setupDateTimeValidation(): void {
    const fechaInicioControl = this.convocatoriaForm.get('fecha_inicio');
    const fechaFinControl = this.convocatoriaForm.get('fecha_fin');
    const horaInicioControl = this.convocatoriaForm.get('hora_inicio');
    const horaFinControl = this.convocatoriaForm.get('hora_fin');

    fechaInicioControl
      ?.valueChanges.pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        fechaFinControl?.updateValueAndValidity();
        horaInicioControl?.updateValueAndValidity();
        horaFinControl?.updateValueAndValidity();
        this.updateMinTimeFin();
      });

    horaInicioControl
      ?.valueChanges.pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.updateMinTimeFin();
        horaFinControl?.updateValueAndValidity();
      });
  }

  updateMinTimeFin(): void {
    const fechaInicio = this.convocatoriaForm.get('fecha_inicio')?.value;
    const fechaFin = this.convocatoriaForm.get('fecha_fin')?.value;
    const horaInicio = this.convocatoriaForm.get('hora_inicio')?.value;

    if (
      fechaInicio &&
      fechaFin &&
      this.isSameDay(new Date(fechaInicio), new Date(fechaFin))
    ) {
      this.minTimeFin = horaInicio;
    } else {
      this.minTimeFin = '00:00';
    }
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }
  
  isDateDisabled = (date: Date): boolean => {
    return date < this.getToday();
  };

  private getToday(): Date {
    const now = new Date(
      new Date().toLocaleString('en-US', { timeZone: this.timeZone })
    );
    now.setHours(0, 0, 0, 0);
    return now;
  }

  private getTodayDate(): string {
    return this.formatDate(this.getToday());
  }

  private getCurrentTime(): string {
    const now = new Date(
      new Date().toLocaleString('en-US', { timeZone: this.timeZone })
    );
    return this.formatTime(now);
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private formatTime(date: Date): string {
    return date.toTimeString().slice(0, 5);
  }

  private updateConvocatoriasArray(convocatoria: Convocatoria): void {
    const index = this.convocatorias.findIndex((e) => e.id === convocatoria.id);
    if (index !== -1) {
      this.convocatorias[index] = convocatoria;
      this.filterConvocatorias();
    }
  }

  private removeConvocatoriaFromArray(id: number): void {
    this.convocatorias = this.convocatorias.filter((e) => e.id !== id);
    this.filterConvocatorias();
  }

  private updateConvocatoriaStatus(id: number, status: boolean): void {
    const index = this.convocatorias.findIndex((e) => e.id === id);
    if (index !== -1) {
      this.convocatorias[index].activo = status;
      this.filterConvocatorias();
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

  openImageModal(
    convocatoria: Convocatoria,
    type: 'principal' | 'generales'
  ): void {
    this.closeAllModals();
    this.isImageModalOpen = true;
    this.currentImageIndex = 0;
    if (type === 'principal') {
      this.modalTitle = 'Imagen Principal';
      this.allImages = convocatoria.imagen_principal
        ? [convocatoria.imagen_principal]
        : [];
    } else {
      this.modalTitle = 'Imágenes Generales';
      this.allImages = convocatoria.imagenes_generales || [];
    }
  }

  openArchivoModal(convocatoria: Convocatoria): void {
    this.closeAllModals();
    this.isArchivoModalOpen = true;
    if (convocatoria.archivos && convocatoria.archivos.length > 0) {
      this.archivosActuales = convocatoria.archivos.map((archivo) => ({
        ...archivo,
        ruta_archivo: this.getFileUrl(archivo.ruta_archivo),
      }));
    } else {
      this.archivosActuales = [];
    }
  }

  closeAllModals(): void {
    this.isImageModalOpen = false;
    this.isArchivoModalOpen = false;
    this.archivosActuales = [];
    this.allImages = [];
  }

  closeImageModal(): void {
    this.isImageModalOpen = false;
    this.allImages = [];
  }

  closeArchivoModal(): void {
    this.isArchivoModalOpen = false;
    this.archivosActuales = [];
  }

  getFileUrl(relativePath: string): string {
    if (relativePath && relativePath.startsWith('../')) {
      return this.baseImageUrl + relativePath.substring(3);
    }
    return this.baseImageUrl + relativePath;
  }
}
