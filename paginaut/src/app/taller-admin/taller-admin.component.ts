import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Taller, TallerService } from '../tallerService/taller.service';

@Component({
  selector: 'app-taller-admin',
  templateUrl: './taller-admin.component.html',
  styleUrl: './taller-admin.component.css'
})

export class TallerAdminComponent implements OnInit {
  talleres: Taller[] = [];
  filteredTalleres: Taller[] = [];
  papeleraTalleres: Taller[] = [];
  tallerForm: FormGroup;
  isModalOpen = false;
  currentTallerId: number | null = null;
  isLoading = false;
  responseMessage = '';
  baseImageUrl = 'http://localhost/paginaut/';
  imagenPrincipalPreview: string | ArrayBuffer | null = null;
  imagenesGeneralesActuales: string[] = [];
  isImageModalOpen = false;
  modalTitle = '';
  currentImageIndex = 0;
  allImages: string[] = [];

  constructor(
    private tallerService: TallerService,
    private fb: FormBuilder
  ) {
    this.tallerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      descripcion: ['', Validators.maxLength(200)],
      competencia: ['', Validators.maxLength(200)],
      activo: [true]
    });
  }

  ngOnInit(): void {
    this.loadTalleres();
  }
  
  loadTalleres(): void {
    this.tallerService.obtenerTaller().subscribe({
      next: (response) => {
        this.talleres = response.records.map(taller => ({
          ...taller,
          imagen_principal: this.getImageUrl(taller.imagen_principal || ''),
          imagenes_generales: (taller.imagenes_generales || []).map((img: string) => this.getImageUrl(img))
        }));
        this.filterTalleres();
      },
      error: (error) => console.error('Error al cargar talleres:', error)
    });
  }

  getImageUrl(relativePath: string): string {
    if (relativePath && relativePath.startsWith('../')) {
      return this.baseImageUrl + relativePath.substring(3);
    }
    return this.baseImageUrl + relativePath;
  }

  filterTalleres(): void {
    this.filteredTalleres = this.talleres.filter(taller => taller.activo !== false);
    this.papeleraTalleres = this.talleres.filter(taller => taller.activo === false);
  }

  openModal(taller?: Taller): void {
    this.isModalOpen = true;
    if (taller) {
      this.currentTallerId = taller.id!;
      this.tallerForm.patchValue(taller);
      this.imagenPrincipalPreview = taller.imagen_principal || null;
      this.imagenesGeneralesActuales = taller.imagenes_generales || [];
    } else {
      this.currentTallerId = null;
      this.tallerForm.reset({ activo: true });
      this.imagenPrincipalPreview = null;
      this.imagenesGeneralesActuales = [];
    }
    this.clearFileInputs();
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.tallerForm.reset();
    this.currentTallerId = null;
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
    if (this.tallerForm.valid) {
      this.isLoading = true;
      const tallerData: Taller = {
        ...this.tallerForm.value,
        id: this.currentTallerId,
        imagen_principal: this.imagenPrincipalPreview as string,
        imagenes_generales: this.imagenesGeneralesActuales
      };
  
      const imagenPrincipalInput = document.getElementById('imagenPrincipal') as HTMLInputElement;
      const imagenPrincipal = imagenPrincipalInput.files?.[0];
      const imagenesGeneralesInput = document.getElementById('imagenesGenerales') as HTMLInputElement;
      const imagenesGenerales = imagenesGeneralesInput.files;
  
      if (this.currentTallerId) {
        this.tallerService.actualizarTaller(
          tallerData,
          imagenPrincipal,
          imagenesGenerales ? Array.from(imagenesGenerales) : undefined
        ).subscribe({
          next: (response) => {
            this.responseMessage = 'Taller actualizado con éxito';
            this.closeModal();
            this.loadTalleres();
          },
          error: (error) => {
            console.error('Error al actualizar el taller:', error);
            this.responseMessage = 'Error al actualizar el taller: ' + (error.error?.message || error.message);
          },
          complete: () => {
            this.isLoading = false;
          }
        });
      } else {
        this.tallerService.crearTaller(
          tallerData,
          imagenPrincipal,
          imagenesGenerales ? Array.from(imagenesGenerales) : undefined
        ).subscribe({
          next: (response) => {
            this.responseMessage = 'Taller creado con éxito';
            this.closeModal();
            this.loadTalleres();
          },
          error: (error) => {
            console.error('Error al crear el taller:', error);
            this.responseMessage = 'Error al crear el taller: ' + (error.error?.message || error.message);
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

  confirmDeleteTaller(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este taller?')) {
      this.tallerService.eliminarTaller(id).subscribe({
        next: () => {
          this.responseMessage = 'Taller eliminado con éxito';
          this.loadTalleres();
        },
        error: (error) => {
          this.responseMessage = 'Error al eliminar el taller';
          console.error('Error:', error);
        }
      });
    }
  }

  desactivarTaller(id: number): void {
    if (confirm('¿Estás seguro de que quieres desactivar este taller?')) {
      this.tallerService.desactivarTaller(id).subscribe({
        next: () => {
          this.responseMessage = 'Taller desactivado con éxito';
          this.loadTalleres();
        },
        error: (error) => {
          this.responseMessage = 'Error al desactivar el taller';
          console.error('Error:', error);
        }
      });
    }
  }

  activarTaller(id: number): void {
    if (confirm('¿Estás seguro de que quieres activar este taller?')) {
      this.tallerService.activarTaller(id).subscribe({
        next: () => {
          this.responseMessage = 'Taller activado con éxito';
          this.loadTalleres();
        },
        error: (error) => {
          this.responseMessage = 'Error al activar el taller';
          console.error('Error:', error);
        }
      });
    }
  }

  filterGlobal(event: any): void {
    const searchValue = event.target.value.toLowerCase();
    this.filteredTalleres = this.talleres.filter(taller => 
      taller.nombre && taller.nombre.toLowerCase().includes(searchValue) ||
      taller.descripcion.toLowerCase().includes(searchValue) ||
      taller.competencia.toLowerCase().includes(searchValue) ||
      taller.fecha_publicacion.toLowerCase().includes(searchValue)
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
    if (this.currentTallerId && imagenParaEliminar.startsWith(this.baseImageUrl)) {
      const relativePath = imagenParaEliminar.replace(this.baseImageUrl, '');
      this.tallerService.eliminarImagenGeneral(this.currentTallerId, relativePath).subscribe({
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

  openImageModal(taller: Taller, type: 'principal' | 'generales'): void {
    this.isImageModalOpen = true;
    this.currentImageIndex = 0;
    if (type === 'principal') {
      this.modalTitle = 'Imagen Principal';
      this.allImages = [taller.imagen_principal!];
    } else {
      this.modalTitle = 'Imágenes Generales';
      this.allImages = taller.imagenes_generales || [];
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
    if (tab == 'active') {
      this.filteredTalleres = this.talleres.filter(taller => taller.activo === true);
    } else {
      this.filteredTalleres = this.papeleraTalleres;
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.tallerForm.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched)) : false;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.tallerForm.get(fieldName);
    if (field?.errors?.['required']) {
      return 'Este campo es requerido.';
    }
    if (field?.errors?.['maxlength']) {
      return `Máximo ${field.errors['maxlength'].requiredLength} caracteres.`;
    }
    return '';
  }

  private updateTalleresArray(taller: Taller): void {
    const index = this.talleres.findIndex(n => n.id === taller.id);
    if (index !== -1) {
      this.talleres[index] = taller;
      this.filterTalleres();
    }
  }

  private removeTallerFromArray(id: number): void {
    this.talleres = this.talleres.filter(n => n.id !== id);
    this.filterTalleres();
  }

  private updateTallerStatus(id: number, status: boolean): void {
    const index = this.talleres.findIndex(n => n.id === id);
    if (index !== -1) {
      this.talleres[index].activo = status;
      this.filterTalleres();
    }
  }
}

