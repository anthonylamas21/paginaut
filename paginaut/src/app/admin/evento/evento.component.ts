import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventoService, Evento } from '../../evento.service';

interface EventoTemporal extends Evento {
  imagenesGeneralesOriginales?: string[];
  archivosOriginales?: any[];
  imagenPrincipalOriginal?: string;
}

@Component({
  selector: 'app-evento',
  templateUrl: './evento.component.html',
  styleUrls: ['./evento.component.css']
})
export class EventoComponent implements OnInit {
  eventos: Evento[] = [];
  filteredEventos: Evento[] = [];
  papeleraEventos: Evento[] = [];
  eventoForm: FormGroup;
  isModalOpen = false;
  currentEventoId: number | null = null;
  isLoading = false;
  responseMessage = '';
  baseImageUrl = 'http://localhost/paginaut/';
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

  constructor(
    private eventoService: EventoService,
    private fb: FormBuilder
  ) {
    this.eventoForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(50)]],
      informacion_evento: ['', Validators.required],
      activo: [true],
      lugar_evento: ['', [Validators.required, Validators.maxLength(50)]],
      fecha_inicio: ['', Validators.required],
      fecha_fin: ['', Validators.required],
      hora_inicio: ['', Validators.required],
      hora_fin: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadEventos();
  }
  
  loadEventos(): void {
    this.eventoService.obtenerEventos().subscribe({
      next: (response) => {
        this.eventos = response.records.map(evento => ({
          ...evento,
          imagen_principal: this.getImageUrl(evento.imagen_principal || ''),
          imagenes_generales: (evento.imagenes_generales || []).map((img: string) => this.getImageUrl(img)),
          archivos: evento.archivos || []
        }));
        this.filterEventos();
      },
      error: (error) => console.error('Error al cargar eventos:', error)
    });
  }

  getImageUrl(relativePath: string): string {
    if (relativePath && relativePath.startsWith('../')) {
      return this.baseImageUrl + relativePath.substring(3);
    }
    return this.baseImageUrl + relativePath;
  }

  filterEventos(): void {
    this.filteredEventos = this.eventos.filter(evento => evento.activo !== false);
    this.papeleraEventos = this.eventos.filter(evento => evento.activo === false);
  }

  openModal(evento?: Evento): void {
    this.isModalOpen = true;
    if (evento) {
      this.currentEventoId = evento.id!;

      
      
      // Formatear las fechas
      const fechaInicio = evento.fecha_inicio ? this.formatDate(new Date(evento.fecha_inicio)) : '';
      const fechaFin = evento.fecha_fin ? this.formatDate(new Date(evento.fecha_fin)) : '';

      this.eventoForm.patchValue({
        ...evento,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin
      });

      this.imagenPrincipalPreview = evento.imagen_principal || null;
      this.imagenesGeneralesActuales = [...evento.imagenes_generales || []];
      this.archivosActuales = [...evento.archivos || []];
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

  // Método auxiliar para formatear fechas
  private formatDate(date: Date): string {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
  }

  closeModal(): void {
    if (this.eventoTemporal) {
      // Restaurar los valores originales
      const eventoOriginal = this.eventos.find(e => e.id === this.currentEventoId);
      if (eventoOriginal) {
        eventoOriginal.imagen_principal = this.eventoTemporal.imagenPrincipalOriginal;
        eventoOriginal.imagenes_generales = this.eventoTemporal.imagenesGeneralesOriginales;
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
    const imagenPrincipalInput = document.getElementById('imagenPrincipal') as HTMLInputElement;
    const imagenesGeneralesInput = document.getElementById('imagenesGenerales') as HTMLInputElement;
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
    if (this.eventoForm.valid) {
      this.isLoading = true;
      const eventoData: Evento = {
        ...this.eventoForm.value,
        id: this.currentEventoId,
        imagen_principal: this.imagenPrincipalPreview as string,
        imagenes_generales: this.imagenesGeneralesActuales,
        archivos: this.archivosActuales
      };
  
      const imagenPrincipalInput = document.getElementById('imagenPrincipal') as HTMLInputElement;
      const imagenPrincipal = imagenPrincipalInput.files?.[0];
      const imagenesGeneralesInput = document.getElementById('imagenesGenerales') as HTMLInputElement;
      const imagenesGenerales = imagenesGeneralesInput.files;
      const archivosInput = document.getElementById('archivos') as HTMLInputElement;
      const archivos = archivosInput.files;
  
      if (this.currentEventoId) {
        // Primero, elimina las imágenes y archivos marcados
        const deletePromises: Promise<any>[] = [
          ...this.imagenesParaEliminar.map(ruta => 
            this.eventoService.eliminarImagenGeneral(this.currentEventoId!, ruta).toPromise()
          ),
          ...this.archivosParaEliminar.map(ruta => 
            this.eventoService.eliminarArchivo(this.currentEventoId!, ruta).toPromise()
          )
        ];
  
        Promise.all(deletePromises)
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
            this.responseMessage = 'Evento actualizado con éxito';
            this.closeModal();
            this.loadEventos();
          })
          .catch(error => {
            console.error('Error al actualizar el evento:', error);
            this.responseMessage = 'Error al actualizar el evento: ' + (error.error?.message || error.message);
          })
          .finally(() => {
            this.isLoading = false;
            // Limpia los arrays de elementos para eliminar
            this.imagenesParaEliminar = [];
            this.archivosParaEliminar = [];
          });
      } else {
            this.eventoService.crearEvento(
                eventoData,
                imagenPrincipal,
                imagenesGenerales ? Array.from(imagenesGenerales) : undefined,
                archivos ? Array.from(archivos) : undefined
            ).subscribe({
                next: (response) => {
                    this.responseMessage = 'Evento creado con éxito';
                    this.closeModal();
                    this.loadEventos();
                },
                error: (error) => {
                    console.error('Error al crear el evento:', error);
                    this.responseMessage = 'Error al crear el evento: ' + (error.error?.message || error.message);
                },
                complete: () => {
                    this.isLoading = false;
                }
            });
        }
    } else {
        this.responseMessage = 'Por favor, complete todos los campos requeridos correctamente.';
    }
}


  confirmDeleteEvento(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este evento?')) {
      this.eventoService.eliminarEvento(id).subscribe({
        next: () => {
          this.responseMessage = 'Evento eliminado con éxito';
          this.loadEventos();
        },
        error: (error) => {
          this.responseMessage = 'Error al eliminar el evento';
          console.error('Error:', error);
        }
      });
    }
  }

  desactivarEvento(id: number): void {
    if (confirm('¿Estás seguro de que quieres desactivar este evento?')) {
      this.eventoService.desactivarEvento(id).subscribe({
        next: () => {
          this.responseMessage = 'Evento desactivado con éxito';
          this.loadEventos();
        },
        error: (error) => {
          this.responseMessage = 'Error al desactivar el evento';
          console.error('Error:', error);
        }
      });
    }
  }

  activarEvento(id: number): void {
    if (confirm('¿Estás seguro de que quieres activar este evento?')) {
      this.eventoService.activarEvento(id).subscribe({
        next: () => {
          this.responseMessage = 'Evento activado con éxito';
          this.loadEventos();
        },
        error: (error) => {
          this.responseMessage = 'Error al activar el evento';
          console.error('Error:', error);
        }
      });
    }
  }

  filterGlobal(event: any): void {
    const searchValue = event.target.value.toLowerCase();
    this.filteredEventos = this.eventos.filter(evento => 
      evento.titulo.toLowerCase().includes(searchValue) ||
      evento.informacion_evento.toLowerCase().includes(searchValue) ||
      evento.lugar_evento.toLowerCase().includes(searchValue)
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
    if (this.currentEventoId && imagenParaEliminar.startsWith(this.baseImageUrl)) {
      const relativePath = imagenParaEliminar.replace(this.baseImageUrl, '');
      this.imagenesParaEliminar.push(relativePath);
    }
    this.imagenesGeneralesActuales.splice(index, 1);
  }
  
  removeArchivo(index: number): void {
    const archivoParaEliminar = this.archivosActuales[index];
    if (this.currentEventoId && archivoParaEliminar.ruta_archivo) {
      const relativePath = archivoParaEliminar.ruta_archivo.replace(this.baseImageUrl, '');
      this.archivosParaEliminar.push(relativePath);
    }
    this.archivosActuales.splice(index, 1);
  }

  openImageModal(evento: Evento, type: 'principal' | 'generales'): void {
    this.isImageModalOpen = true;
    this.currentImageIndex = 0;
    if (type === 'principal') {
      this.modalTitle = 'Imagen Principal';
      this.allImages = [evento.imagen_principal!];
    } else {
      this.modalTitle = 'Imágenes Generales';
      this.allImages = evento.imagenes_generales || [];
    }
  }

  closeImageModal(): void {
    this.isImageModalOpen = false;
  }

  openArchivoModal(evento: Evento): void {
    this.isArchivoModalOpen = true;
    this.archivosActuales = evento.archivos || [];
  }

  closeArchivoModal(): void {
    this.isArchivoModalOpen = false;
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
      this.filteredEventos = this.eventos.filter(evento => evento.activo !== false);
    } else {
      this.filteredEventos = this.papeleraEventos;
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.eventoForm.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched)) : false;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.eventoForm.get(fieldName);
    if (field?.errors?.['required']) {
      return 'Este campo es requerido.';
    }
    if (field?.errors?.['maxlength']) {
      return `Máximo ${field.errors['maxlength'].requiredLength} caracteres.`;
    }
    return '';
  }

  private updateEventosArray(evento: Evento): void {
    const index = this.eventos.findIndex(e => e.id === evento.id);
    if (index !== -1) {
      this.eventos[index] = evento;
      this.filterEventos();
    }
  }

  private removeEventoFromArray(id: number): void {
    this.eventos = this.eventos.filter(e => e.id !== id);
    this.filterEventos();
  }

  private updateEventoStatus(id: number, status: boolean): void {
    const index = this.eventos.findIndex(e => e.id === id);
    if (index !== -1) {
      this.eventos[index].activo = status;
      this.filterEventos();
    }
  }
}
