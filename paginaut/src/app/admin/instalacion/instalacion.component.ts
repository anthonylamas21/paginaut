import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Instalacion,InstalacionService } from '../../instalacionService/instalacion.service';

@Component({
  selector: 'app-instalacion',
  templateUrl: './instalacion.component.html',
  styleUrls: ['./instalacion.component.css']
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
      titulo: ['', [Validators.required, Validators.maxLength(50)]],
      resumen: ['', Validators.maxLength(200)],
      activo: [true]
    });
  }

  ngOnInit(): void {
    this.loadInstalaciones();
  }
  
  loadInstalaciones(): void {
    this.instalacionService.obtenerInstalacion().subscribe({
      next: (response) => {
        this.instalaciones = response.records.map(instalacion => ({
          ...instalacion,
          titulo: instalacion.nombre,
          imagen_principal: this.getImageUrl(instalacion.imagen_principal || ''),
          imagenes_generales: (instalacion.imagenes_generales || []).map((img: string) => this.getImageUrl(img))
        }));
        this.filterInstalaciones();
      },
      error: (error) => console.error('Error al cargar instalaciones:', error)
    });
  }

  getImageUrl(relativePath: string): string {
    if (relativePath && relativePath.startsWith('../')) {
      return this.baseImageUrl + relativePath.substring(3);
    }
    return this.baseImageUrl + relativePath;
  }

  filterInstalaciones(): void {
    this.filteredInstalaciones = this.instalaciones.filter(instalacion => instalacion.activo !== false);
    this.papeleraInstalaciones = this.instalaciones.filter(instalacion => instalacion.activo === false);
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
    if (this.instalacionForm.valid) {
      this.isLoading = true;
      const instalacionData: Instalacion = {
        ...this.instalacionForm.value,
        id: this.currentInstalacionId,
        imagen_principal: this.imagenPrincipalPreview as string,
        imagenes_generales: this.imagenesGeneralesActuales
      };
  
      const imagenPrincipalInput = document.getElementById('imagenPrincipal') as HTMLInputElement;
      const imagenPrincipal = imagenPrincipalInput.files?.[0];
      const imagenesGeneralesInput = document.getElementById('imagenesGenerales') as HTMLInputElement;
      const imagenesGenerales = imagenesGeneralesInput.files;
  
      if (this.currentInstalacionId) {
        this.instalacionService.actualizarInstalacion(
          instalacionData,
          imagenPrincipal,
          imagenesGenerales ? Array.from(imagenesGenerales) : undefined
        ).subscribe({
          next: (response) => {
            this.responseMessage = 'Instalación actualizada con éxito';
            this.closeModal();
            this.loadInstalaciones();
          },
          error: (error) => {
            console.error('Error al actualizar la instalación:', error);
            this.responseMessage = 'Error al actualizar la instalación: ' + (error.error?.message || error.message);
          },
          complete: () => {
            this.isLoading = false;
          }
        });
      } else {
        this.instalacionService.crearInstalacion(
          instalacionData,
          imagenPrincipal,
          imagenesGenerales ? Array.from(imagenesGenerales) : undefined
        ).subscribe({
          next: (response) => {
            this.responseMessage = 'Instalación creada con éxito';
            this.closeModal();
            this.loadInstalaciones();
          },
          error: (error) => {
            console.error('Error al crear la instalación:', error);
            this.responseMessage = 'Error al crear la instalación: ' + (error.error?.message || error.message);
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

  confirmDeleteInstalacion(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta instalación?')) {
      this.instalacionService.eliminarInstalacion(id).subscribe({
        next: () => {
          this.responseMessage = 'Instalación eliminada con éxito';
          this.loadInstalaciones();
        },
        error: (error) => {
          this.responseMessage = 'Error al eliminar la instalación';
          console.error('Error:', error);
        }
      });
    }
  }

  desactivarInstalacion(id: number): void {
    if (confirm('¿Estás seguro de que quieres desactivar esta instalación?')) {
      this.instalacionService.desactivarInstalacion(id).subscribe({
        next: () => {
          this.responseMessage = 'Instalación desactivada con éxito';
          this.loadInstalaciones();
        },
        error: (error) => {
          this.responseMessage = 'Error al desactivar la instalación';
          console.error('Error:', error);
        }
      });
    }
  }

  activarInstalacion(id: number): void {
    if (confirm('¿Estás seguro de que quieres activar esta instalación?')) {
      this.instalacionService.activarInstalacion(id).subscribe({
        next: () => {
          this.responseMessage = 'Instalación activada con éxito';
          this.loadInstalaciones();
        },
        error: (error) => {
          this.responseMessage = 'Error al activar la instalación';
          console.error('Error:', error);
        }
      });
    }
  }

  filterGlobal(event: any): void {
    const searchValue = event.target.value.toLowerCase();
    this.filteredInstalaciones = this.instalaciones.filter(instalacion => 
      (instalacion.nombre && instalacion.nombre.toLowerCase().includes(searchValue)) ||
      instalacion.fecha_publicacion.toLowerCase().includes(searchValue)
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
    if (this.currentInstalacionId && imagenParaEliminar.startsWith(this.baseImageUrl)) {
        const relativePath = imagenParaEliminar.replace(this.baseImageUrl, '');
        this.instalacionService.eliminarImagenGeneral(this.currentInstalacionId, relativePath).subscribe({
            next: () => {
                this.imagenesGeneralesActuales.splice(index, 1);
            },
            error: (error) => {
                console.error('Error al eliminar la imagen:', error);
            }
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
      this.filteredInstalaciones = this.instalaciones.filter(instalacion => instalacion.activo !== false);
    } else {
      this.filteredInstalaciones = this.papeleraInstalaciones;
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.instalacionForm.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched)) : false;
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
    const index = this.instalaciones.findIndex(n => n.id === instalacion.id);
    if (index !== -1) {
      this.instalaciones[index] = instalacion;
      this.filterInstalaciones();
    }
  }

  private removeInstalacionFromArray(id: number): void {
    this.instalaciones = this.instalaciones.filter(n => n.id !== id);
    this.filterInstalaciones();
  }

  private updateInstalacionStatus(id: number, status: boolean): void {
    const index = this.instalaciones.findIndex(n => n.id === id);
    if (index !== -1) {
      this.instalaciones[index].activo = status;
      this.filterInstalaciones();
    }
  }

  
}
