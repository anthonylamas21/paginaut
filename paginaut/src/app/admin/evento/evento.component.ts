import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { EventoService, Evento } from '../../evento.service';
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

interface EventoTemporal extends Evento {
  imagenesGeneralesOriginales?: string[];
  archivosOriginales?: any[];
  imagenPrincipalOriginal?: string;
}

@Component({
  selector: 'app-evento',
  templateUrl: './evento.component.html',
  styleUrls: ['./evento.component.css'],
})
export class EventoComponent implements OnInit,  OnDestroy {
  eventos: Evento[] = [];
  filteredEventos: Evento[] = [];
  papeleraEventos: Evento[] = [];
  cursos: Curso[] = []; // Lista de cursos
  eventoForm: FormGroup;
  isModalOpen = false;
  currentEventoId: number | null = null;
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
  eventoTemporal: EventoTemporal | null = null;
  minDate: string;
  minTimeInicio: string;
  minTimeFin: string;
  timeZone: string = 'America/Mazatlan';
    private unsubscribe$ = new Subject<void>();


    constructor(
      private eventoService: EventoService,
      private cursoService: CursoService,
      private fb: FormBuilder
    ) {
      this.minDate = this.getTodayDate();
      this.minTimeInicio = this.getCurrentTime();
      this.minTimeFin = this.minTimeInicio;
    
      this.eventoForm = this.fb.group({
        titulo: ['', [ soloLetras(true),Validators.required, Validators.minLength(15), Validators.maxLength(150)]],
        informacion_evento: ['', [ soloLetrasConPuntuacion(true),Validators.required, Validators.minLength(15), Validators.maxLength(2000)]],
        activo: [true],
        lugar_evento: ['', [soloLetrasConPuntuacion(true), Validators.required, Validators.minLength(5), Validators.maxLength(150)]],
        fecha_inicio: ['', [this.fechaHoraValidator(), Validators.required]],
        fecha_fin: ['', [this.fechaHoraValidator(), Validators.required]],
        hora_inicio: ['', [this.fechaHoraValidator(), Validators.required]],
        hora_fin: ['', [this.fechaHoraValidator(), Validators.required]],
        es_curso: [null, Validators.required],
        curso_id: [null],
        imagen_principal: [null, Validators.required]
      });
    }
    

    ngOnInit(): void {
      this.loadEventos();
      this.loadCursos(); // Cargar los cursos
      this.setupDateTimeValidation();
      this.setNavbarColor();

      this.eventoForm.get('es_curso')?.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(value => {
          if (value === true) {
              // Si selecciona "Sí", hacer que curso_id sea obligatorio
              this.eventoForm.get('curso_id')?.setValidators([Validators.required]);
              this.eventoForm.get('curso_id')?.updateValueAndValidity();
          } else {
              // Si selecciona "No", limpiar curso_id y remover validación
              this.eventoForm.get('curso_id')?.clearValidators();
              this.eventoForm.get('curso_id')?.setValue(null);
              this.eventoForm.get('curso_id')?.updateValueAndValidity();
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
      nabvar.classList.add('bg-primary-color');
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
      }
    });
  }

  loadEventos(): void {
    this.eventoService.obtenerEventos().subscribe({
      next: (response) => {
        this.eventos = response.records.map((evento) => {
          // Agregar las fechas y horarios formateados
          const eventoConFechasFormateadas = this.addFormattedDate(evento);
  
          // Retornar el evento con las imágenes y fechas formateadas
          return {
            ...eventoConFechasFormateadas,
            imagen_principal: this.getImageUrl(evento.imagen_principal || ''),
            imagenes_generales: (evento.imagenes_generales || []).map((img: string) => this.getImageUrl(img)),
          };
        });
        this.filterEventos(); // Esto filtra o realiza otras operaciones necesarias
      }
    });
  }
  
  private addFormattedDate(evento: Evento): Evento & { fecha_string: string, horario_string: string } {
    return {
      ...evento,
      // Pasamos la fecha como string, que luego se formatea correctamente
      fecha_string: this.formatDateString(evento.fecha_inicio) + ' - ' + this.formatDateString(evento.fecha_fin),
      horario_string: this.formatHorarioString(evento.hora_inicio) + ' - ' + this.formatHorarioString(evento.hora_fin),
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

  filterEventos(): void {
    this.filteredEventos = this.eventos.filter(
      (evento) => evento.activo !== false
    );
    this.papeleraEventos = this.eventos.filter(
      (evento) => evento.activo === false
    );
  }

  openModal(evento?: Evento): void {
    this.isModalOpen = true;
    if (evento) {
      this.currentEventoId = evento.id!;

      // Formatear las fechas
      const fechaInicio = evento.fecha_inicio
        ? this.formatDate(new Date(evento.fecha_inicio))
        : '';
      const fechaFin = evento.fecha_fin
        ? this.formatDate(new Date(evento.fecha_fin))
        : '';

      this.eventoForm.patchValue({
        ...evento,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        es_curso: evento.es_curso || false,
        curso_id: evento.curso_id || null,
      });

      this.imagenPrincipalPreview = evento.imagen_principal || null;
      this.imagenesGeneralesActuales = [...(evento.imagenes_generales || [])];
      this.archivosActuales = [...(evento.archivos || [])];
    } else {
      this.currentEventoId = null;
      this.eventoTemporal = null;
      this.eventoForm.reset({ activo: true });
      this.imagenPrincipalPreview = null;
      this.imagenesGeneralesActuales = [];
      this.archivosActuales = [];
    }
    this.clearFileInputs();
  }



  closeModal(): void {
    if (this.eventoTemporal) {
      // Restaurar los valores originales
      const eventoOriginal = this.eventos.find(
        (e) => e.id === this.currentEventoId
      );
      if (eventoOriginal) {
        eventoOriginal.imagen_principal =
          this.eventoTemporal.imagenPrincipalOriginal;
        eventoOriginal.imagenes_generales =
          this.eventoTemporal.imagenesGeneralesOriginales;
        eventoOriginal.archivos = this.eventoTemporal.archivosOriginales;
      }
    }

    this.isModalOpen = false;
    this.eventoForm.reset();
    this.currentEventoId = null;
    this.eventoTemporal = null;
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
    const archivosInput = document.getElementById(
      'archivos'
    ) as HTMLInputElement;
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
    if (this.eventoForm.valid) {
        this.isLoading = true;
        const eventoData: Evento = {
            ...this.eventoForm.value,
            id: this.currentEventoId,
            imagen_principal: this.imagenPrincipalPreview as string,
            imagenes_generales: this.imagenesGeneralesActuales,
            archivos: this.archivosActuales,
            es_curso: this.eventoForm.get('es_curso')?.value,
            curso_id: this.eventoForm.get('curso_id')?.value
        };

        const imagenPrincipalInput = document.getElementById('imagenPrincipal') as HTMLInputElement;
        const imagenPrincipal = imagenPrincipalInput.files?.[0];
        const imagenesGeneralesInput = document.getElementById('imagenesGenerales') as HTMLInputElement;
        const imagenesGenerales = imagenesGeneralesInput.files;
        const archivosInput = document.getElementById('archivos') as HTMLInputElement;
        const archivos = archivosInput.files;

        if (this.currentEventoId) {
            // Primero, elimina las imágenes y archivos marcados
            const deleteImagenesPromises: Promise<any>[] = this.imagenesParaEliminar.map(ruta =>
                this.eventoService.eliminarImagenGeneral(this.currentEventoId!, ruta).toPromise()
            );

            const deleteArchivosPromises: Promise<any>[] = this.archivosParaEliminar.map(ruta =>
                this.eventoService.eliminarArchivo(this.currentEventoId!, ruta).toPromise()
            );

            Promise.all([...deleteImagenesPromises, ...deleteArchivosPromises])
                .then(() => {
                    // Luego, actualiza el evento
                    return this.eventoService.actualizarEvento(
                        eventoData,
                        imagenPrincipal,
                        imagenesGenerales ? Array.from(imagenesGenerales) : undefined,
                        archivos ? Array.from(archivos) : undefined
                    ).toPromise();
                })
                .then(() => {
                    this.showToast('success', 'Evento actualizado con éxito');
                    this.closeModal();
                    this.loadEventos();
                })
                .catch(error => {
                    // console.error('Error al actualizar el evento:', error);
                    this.showToast('error', 'Error al actualizar el evento: ' + (error.error?.message || error.message));
                })
                .finally(() => {
                    this.isLoading = false;
                    this.imagenesParaEliminar = [];
                    this.archivosParaEliminar = [];
                });
        } else {
            // Crear nuevo evento
            this.eventoService.crearEvento(
                eventoData,
                imagenPrincipal,
                imagenesGenerales ? Array.from(imagenesGenerales) : undefined,
                archivos ? Array.from(archivos) : undefined
            ).subscribe({
                next: (response) => {
                    this.showToast('success', 'Evento creado con éxito');
                    this.closeModal();
                    this.loadEventos();
                },
                error: (error) => {
                    // console.error('Error al crear el evento:', error);
                    this.showToast('error', 'Error al crear el evento: ' + (error.error?.message || error.message));
                },
                complete: () => {
                    this.isLoading = false;
                }
            });
        }
    } else {
        this.showToast('warning', 'Por favor, complete todos los campos requeridos correctamente.');
        Object.keys(this.eventoForm.controls).forEach(key => {
            const control = this.eventoForm.get(key);
            control?.markAsTouched();
        });
    }
}




  isFormValid(): boolean {
    return this.eventoForm.valid;
  }

  confirmDeleteEvento(id: number): void {
    this.showConfirmDialog(
      '¿Estás seguro?',
      '¿Quieres eliminar este evento? Esta acción no se puede deshacer.',
      () => {
        this.eventoService.eliminarEvento(id).subscribe({
          next: () => {
            this.showToast('success', 'Evento eliminado con éxito');
            this.loadEventos();
          },
          error: (error) => {
            this.showToast(
              'error',
              'Error al eliminar el evento: ' +
                (error.error?.message || error.message)
            );
            // console.error('Error:', error);
          },
        });
      }
    );
  }

  desactivarEvento(id: number): void {
    this.showConfirmDialog(
      '¿Estás seguro?',
      '¿Quieres desactivar este evento? No será visible para los usuarios.',
      () => {
        this.eventoService.desactivarEvento(id).subscribe({
          next: () => {
            this.showToast('success', 'Evento desactivado con éxito');
            this.loadEventos();
          },
          error: (error) => {
            this.showToast(
              'error',
              'Error al desactivar el evento: ' +
                (error.error?.message || error.message)
            );
            // console.error('Error:', error);
          },
        });
      }
    );
  }

  activarEvento(id: number): void {
    this.showConfirmDialog(
      '¿Estás seguro?',
      '¿Quieres activar este evento? Será visible para los usuarios.',
      () => {
        this.eventoService.activarEvento(id).subscribe({
          next: () => {
            this.showToast('success', 'Evento activado con éxito');
            this.loadEventos();
          },
          error: (error) => {
            this.showToast(
              'error',
              'Error al activar el evento: ' +
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
    this.filteredEventos = this.eventos.filter((evento) => {
      // Filtrar por convocatorias inactivas (suponiendo que tienes una propiedad "activo" que es true/false)
      return evento.activo && (
        (evento.titulo?.toLowerCase().includes(searchValue) || '') ||
        (evento.informacion_evento?.toLowerCase().includes(searchValue) || '') ||
        (evento.lugar_evento?.toLowerCase().includes(searchValue) || '') ||
        (evento.fecha_string?.toLowerCase().includes(searchValue) || '') ||
        (evento.horario_string?.toLowerCase().includes(searchValue) || '')
      );
    });
  }

  filterGlobalInactive(event: any): void {
    const searchValue = event.target.value.toLowerCase();
    this.papeleraEventos = this.eventos.filter((evento) => {
      // Filtrar por convocatorias inactivas (suponiendo que tienes una propiedad "activo" que es true/false)
      return !evento.activo && (
        (evento.titulo?.toLowerCase().includes(searchValue) || '') ||
        (evento.informacion_evento?.toLowerCase().includes(searchValue) || '') ||
        (evento.lugar_evento?.toLowerCase().includes(searchValue) || '') ||
        (evento.fecha_string?.toLowerCase().includes(searchValue) || '') ||
        (evento.horario_string?.toLowerCase().includes(searchValue) || '')
      );
    });
  }
  

  onFileChangePrincipal(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagenPrincipalPreview = e.target.result;
        this.eventoForm.get('imagen_principal')?.setValue(file); // Actualiza el control de la imagen principal
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
      // Guardamos el nombre y la ruta del archivo
      this.archivosActuales.push({
        nombre_archivo: files[i].name,
        ruta_archivo: URL.createObjectURL(files[i]), // Usamos Object URL para previsualizar el archivo
      });
    }
  }
}


  removeImagenGeneral(index: number): void {
    const imagenParaEliminar = this.imagenesGeneralesActuales[index];
    if (
      this.currentEventoId &&
      imagenParaEliminar.startsWith(this.baseImageUrl)
    ) {
      const relativePath = imagenParaEliminar.replace(this.baseImageUrl, '');
      this.imagenesParaEliminar.push(relativePath);
    }
    this.imagenesGeneralesActuales.splice(index, 1);
  }

  removeArchivo(index: number): void {
    const archivoParaEliminar = this.archivosActuales[index];
    if (this.currentEventoId && archivoParaEliminar.ruta_archivo) {
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
      this.filteredEventos = this.eventos.filter(
        (evento) => evento.activo !== false
      );
    } else {
      this.filteredEventos = this.papeleraEventos;
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
    const fechaInicioControl = this.eventoForm.get('fecha_inicio');
    const fechaFinControl = this.eventoForm.get('fecha_fin');
    const horaInicioControl = this.eventoForm.get('hora_inicio');
    const horaFinControl = this.eventoForm.get('hora_fin');

    fechaInicioControl?.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      fechaFinControl?.updateValueAndValidity();
      horaInicioControl?.updateValueAndValidity();
      horaFinControl?.updateValueAndValidity();
      this.updateMinTimeFin();
    });

    horaInicioControl?.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.updateMinTimeFin();
      horaFinControl?.updateValueAndValidity();
    });
  }

  updateMinTimeFin(): void {
    const fechaInicio = this.eventoForm.get('fecha_inicio')?.value;
    const fechaFin = this.eventoForm.get('fecha_fin')?.value;
    const horaInicio = this.eventoForm.get('hora_inicio')?.value;

    if (fechaInicio && fechaFin && this.isSameDay(new Date(fechaInicio), new Date(fechaFin))) {
      this.minTimeFin = horaInicio;
    } else {
      this.minTimeFin = '00:00';
    }
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  getErrorMessage(fieldName: string): string {
    const field = this.eventoForm.get(fieldName);
    if (field?.errors?.['required']) {
      return 'Este campo es requerido.';
    }
    if (field?.errors?.['maxlength']) {
      return `Máximo ${field.errors['maxlength'].requiredLength} caracteres.`;
    }
    if (field?.errors?.['pattern']) {
      return 'Formato no válido. Solo se permiten letras, números y espacios.';
    }
    if (this.eventoForm.errors?.['fechaHoraInvalida']) {
      return 'La fecha y hora de fin deben ser posteriores a la fecha y hora de inicio.';
    }
    return '';
  }


  isDateDisabled = (date: Date): boolean => {
    return date < this.getToday();
  }

  private getToday(): Date {
    const now = new Date(new Date().toLocaleString('en-US', { timeZone: this.timeZone }));
    now.setHours(0, 0, 0, 0);
    return now;
  }

  private getTodayDate(): string {
    return this.formatDate(this.getToday());
  }

  private getCurrentTime(): string {
    const now = new Date(new Date().toLocaleString('en-US', { timeZone: this.timeZone }));
    return this.formatTime(now);
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private formatTime(date: Date): string {
    return date.toTimeString().slice(0, 5);
  }



  private updateEventosArray(evento: Evento): void {
    const index = this.eventos.findIndex((e) => e.id === evento.id);
    if (index !== -1) {
      this.eventos[index] = evento;
      this.filterEventos();
    }
  }

  private removeEventoFromArray(id: number): void {
    this.eventos = this.eventos.filter((e) => e.id !== id);
    this.filterEventos();
  }

  private updateEventoStatus(id: number, status: boolean): void {
    const index = this.eventos.findIndex((e) => e.id === id);
    if (index !== -1) {
      this.eventos[index].activo = status;
      this.filterEventos();
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
  openImageModal(evento: Evento, type: 'principal' | 'generales'): void {
    this.closeAllModals(); // Cierra todos los modales antes de abrir uno nuevo
    this.isImageModalOpen = true;
    this.currentImageIndex = 0;
    if (type === 'principal') {
      this.modalTitle = 'Imagen Principal';
      this.allImages = evento.imagen_principal ? [evento.imagen_principal] : [];
    } else {
      this.modalTitle = 'Imágenes Generales';
      this.allImages = evento.imagenes_generales || [];
    }
  }

  openArchivoModal(evento: Evento): void {
    this.closeAllModals(); // Cierra todos los modales antes de abrir uno nuevo
    this.isArchivoModalOpen = true;
    if (evento.archivos && evento.archivos.length > 0) {
      this.archivosActuales = evento.archivos.map(archivo => ({
        ...archivo,
        ruta_archivo: this.getFileUrl(archivo.ruta_archivo)
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
