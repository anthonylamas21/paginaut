import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TallerService, Taller, TallerResponse } from '../taller.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-taller',
  templateUrl: './taller.component.html',
  styleUrls: ['./taller.component.css'],
})
export class TallerComponent implements OnInit, AfterViewInit {
  @ViewChild('fileInputPrincipal')
  fileInputPrincipal!: ElementRef<HTMLInputElement>;
  @ViewChild('fileInputGenerales')
  fileInputGenerales!: ElementRef<HTMLInputElement>;

  tallerForm: FormGroup;
  imagenPrincipal: File | undefined;
  imagenesGenerales: File[] = [];
  formSubmitted = false;
  responseMessage = '';
  isLoading = false;
  talleres: Taller[] = [];
  filteredTalleres: Taller[] = [];
  papeleraTalleres: Taller[] = [];
  currentTallerId?: number;
  isModalOpen = false;
  currentTab: 'active' | 'inactive' = 'active';
  baseImageUrl = 'http://localhost/paginaut/';
  selectedTaller: Taller | null = null;
  isImageModalOpen = false;
  currentImageIndex = 0;
  allImages: string[] = [];
  modalTitle: string = '';
  imagenPrincipalPreview: string | undefined;
  imagenesGeneralesActuales: string[] = [];
  isEditMode = false;

  constructor(private fb: FormBuilder, private tallerService: TallerService) {
    this.tallerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      descripcion: ['', [Validators.required, Validators.maxLength(50)]],
      competencia: ['', [Validators.required, Validators.maxLength(50)]],
    });
  }

  ngOnInit(): void {
    this.loadTalleres();
  }

  ngAfterViewInit(): void {
    if (this.fileInputPrincipal) {
      this.fileInputPrincipal.nativeElement.addEventListener(
        'change',
        this.onFileChangePrincipal.bind(this)
      );
    }
    if (this.fileInputGenerales) {
      this.fileInputGenerales.nativeElement.addEventListener(
        'change',
        this.onFileChangeGenerales.bind(this)
      );
    }
  }

  openModal(taller?: Taller): void {
    this.isModalOpen = true;
    if (taller) {
      this.currentTallerId = taller.id;
      this.tallerForm.patchValue(taller);
      this.imagenPrincipalPreview = taller.imagen;
      this.imagenesGeneralesActuales = taller.imagenesGenerales || [];
    } else {
      this.resetForm();
      this.resetImageState();
    }
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.resetForm();
  }

  onFileChangePrincipal(event: Event): void {
    const element = event.target as HTMLInputElement;
    const fileList: FileList | null = element.files;
    if (fileList && fileList.length > 0) {
      this.imagenPrincipal = fileList[0];
      this.previewImagenPrincipal();
    }
  }

  previewImagenPrincipal(): void {
    if (this.imagenPrincipal) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagenPrincipalPreview = e.target.result;
      };
      reader.readAsDataURL(this.imagenPrincipal);
    }
  }

  onFileChangeGenerales(event: Event): void {
    const element = event.target as HTMLInputElement;
    const fileList: FileList | null = element.files;
    if (fileList && fileList.length > 0) {
      this.imagenesGenerales = Array.from(fileList);
    }
  }

  removeImagenGeneral(index: number): void {
    this.imagenesGeneralesActuales.splice(index, 1);
  }

  onSubmit(): void {
    this.formSubmitted = true;
    if (this.tallerForm.valid) {
      this.isLoading = true;
      const tallerData: Taller = {
        id: this.currentTallerId,
        nombre: this.tallerForm.get('nombre')?.value,
        descripcion: this.tallerForm.get('descripcion')?.value,
        competencia: this.tallerForm.get('competencia')?.value,
        activo: true,
      };

      let observable: Observable<any>;

      if (this.currentTallerId) {
        observable = this.tallerService.actualizarTaller(
          tallerData,
          this.imagenPrincipal,
          this.imagenesGenerales,
          this.imagenesGeneralesActuales
        );
      } else {
        observable = this.tallerService.crearTaller(
          tallerData,
          this.imagenPrincipal,
          this.imagenesGenerales
        );
      }

      observable.subscribe({
        next: (response: any) => {
          // console.log(
          //   this.currentTallerId ? 'Taller actualizado' : 'Taller creado',
          //   response
          // );
          this.responseMessage = this.currentTallerId
            ? 'Taller actualizado con éxito'
            : 'Taller creado con éxito';
          this.loadTalleres();
          this.closeModal();
        },
        error: (error: any) => {
          // console.error('Error en la operación del taller', error);
          this.responseMessage = `Error: ${
            error.message || 'Ha ocurrido un error desconocido'
          }`;
        },
        complete: () => {
          this.isLoading = false;
        },
      });
    } else {
      this.responseMessage =
        'Por favor, complete todos los campos requeridos correctamente.';
    }
  }

  loadTalleres(): void {
    this.tallerService.obtenerTalleres().subscribe({
      next: (response: TallerResponse) => {
        if (response && response.records && Array.isArray(response.records)) {
          this.talleres = response.records.map((taller: Taller) => ({
            ...taller,
            imagen: this.getImageUrl(taller.imagen || ''),
            imagenesGenerales: (taller.imagenesGenerales || []).map(
              (img: string) => this.getImageUrl(img)
            ),
          }));
          this.filterTalleres();
        } else {
          // console.error('Formato de respuesta inesperado:', response);
        }
      }
    });
  }

  getImageUrl(relativePath: string): string {
    if (relativePath && relativePath.startsWith('../')) {
      return this.baseImageUrl + relativePath.substring(3);
    }
    return this.baseImageUrl + relativePath;
  }

  filterTalleres(): void {
    if (!Array.isArray(this.talleres)) {
      this.talleres = [];
    }
    this.filteredTalleres = this.talleres.filter(
      (taller) => taller.activo !== false
    );
    this.papeleraTalleres = this.talleres.filter(
      (taller) => taller.activo === false
    );
  }

  resetForm(): void {
    this.formSubmitted = false;
    this.tallerForm.reset();
    this.currentTallerId = undefined;
    this.resetImageState();
  }

  resetImageState(): void {
    this.imagenPrincipal = undefined;
    this.imagenesGenerales = [];
    this.imagenPrincipalPreview = undefined;
    this.imagenesGeneralesActuales = [];
    if (this.fileInputPrincipal) {
      this.fileInputPrincipal.nativeElement.value = '';
    }
    if (this.fileInputGenerales) {
      this.fileInputGenerales.nativeElement.value = '';
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.tallerForm.get(fieldName);
    return !!(
      field &&
      field.invalid &&
      (field.dirty || field.touched || this.formSubmitted)
    );
  }

  getErrorMessage(fieldName: string): string {
    const field = this.tallerForm.get(fieldName);
    if (field?.errors?.['required']) {
      return 'Este campo es requerido.';
    }
    if (field?.errors?.['maxlength']) {
      return `El máximo de caracteres permitidos es ${field.errors['maxlength'].requiredLength}.`;
    }
    return '';
  }

  confirmDeleteTaller(id: number | undefined): void {
    if (id !== undefined) {
      this.changeTallerStatus(id, false);
    }
  }

  changeTallerStatus(id: number, status: boolean): void {
    const tallerToUpdate = this.talleres.find((t) => t.id === id);
    if (tallerToUpdate) {
      tallerToUpdate.activo = status;

      this.tallerService.actualizarTaller(tallerToUpdate).subscribe({
        next: (response) => {
          // console.log('Taller actualizado con éxito', response);
          this.loadTalleres();
        },
        error: (error) => {
          // console.error('Error al actualizar el taller', error);
          this.responseMessage = error.message;
        },
      });
    }
  }

  activateTaller(id: number): void {
    this.changeTallerStatus(id, true);
  }

  filterGlobal(event: Event): void {
    const value = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredTalleres = this.talleres.filter(
      (taller) =>
        taller.nombre.toLowerCase().includes(value) ||
        taller.descripcion.toLowerCase().includes(value) ||
        taller.competencia.toLowerCase().includes(value)
    );
    this.papeleraTalleres = this.talleres.filter(
      (taller) =>
        taller.nombre.toLowerCase().includes(value) ||
        taller.descripcion.toLowerCase().includes(value) ||
        taller.competencia.toLowerCase().includes(value)
    );
  }

  switchTab(tab: 'active' | 'inactive'): void {
    this.currentTab = tab;
    this.filterTalleres();
  }

  openImageModal(taller: Taller, tipo: 'principal' | 'generales'): void {
    this.selectedTaller = taller;
    this.isImageModalOpen = true;
    this.currentImageIndex = 0;

    if (tipo === 'principal') {
      this.allImages = taller.imagen ? [taller.imagen] : [];
      this.modalTitle = 'Imagen Principal';
    } else {
      this.allImages = taller.imagenesGenerales
        ? [...taller.imagenesGenerales]
        : [];
      this.modalTitle = 'Imágenes Generales';
    }

    this.allImages = this.allImages.filter((img) => img != null);
  }

  closeImageModal(): void {
    this.isImageModalOpen = false;
    this.selectedTaller = null;
    this.allImages = [];
  }

  nextImage(): void {
    if (this.allImages.length > 0) {
      this.currentImageIndex =
        (this.currentImageIndex + 1) % this.allImages.length;
    }
  }

  prevImage(): void {
    if (this.allImages.length > 0) {
      this.currentImageIndex =
        (this.currentImageIndex - 1 + this.allImages.length) %
        this.allImages.length;
    }
  }

  getCurrentImage(): string {
    return this.allImages[this.currentImageIndex] || '';
  }

  getTotalImagesCount(): number {
    return this.allImages.length;
  }
}
