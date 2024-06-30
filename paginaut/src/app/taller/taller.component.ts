import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TallerService, Taller } from '../taller.service';

@Component({
  selector: 'app-taller',
  templateUrl: './taller.component.html',
  styleUrls: ['./taller.component.css']
})
export class TallerComponent implements OnInit, AfterViewInit {
  @ViewChild('fileInputPrincipal') fileInputPrincipal!: ElementRef<HTMLInputElement>;
  @ViewChild('fileInputGenerales') fileInputGenerales!: ElementRef<HTMLInputElement>;

  tallerForm: FormGroup;
  imagenPrincipal: File | null = null;
  imagenesGenerales: File[] = [];
  formSubmitted = false;
  responseMessage = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private tallerService: TallerService
  ) {
    this.tallerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      descripcion: ['', [Validators.required, Validators.maxLength(50)]],
      competencia: ['', [Validators.required, Validators.maxLength(50)]],
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.fileInputPrincipal && this.fileInputPrincipal.nativeElement) {
      this.fileInputPrincipal.nativeElement.addEventListener('change', this.onFileChangePrincipal.bind(this));
    } else {
      console.error('fileInputPrincipal is null or undefined');
    }

    if (this.fileInputGenerales && this.fileInputGenerales.nativeElement) {
      this.fileInputGenerales.nativeElement.addEventListener('change', this.onFileChangeGenerales.bind(this));
    } else {
      console.error('fileInputGenerales is null or undefined');
    }
  }

  onFileChangePrincipal(event: Event): void {
    const element = event.target as HTMLInputElement;
    const fileList: FileList | null = element.files;
    if (fileList && fileList.length > 0) {
      this.imagenPrincipal = fileList[0];
      console.log('Imagen principal seleccionada:', this.imagenPrincipal.name);
    }
  }

  onFileChangeGenerales(event: Event): void {
    const element = event.target as HTMLInputElement;
    const fileList: FileList | null = element.files;
    if (fileList && fileList.length > 0) {
      this.imagenesGenerales = Array.from(fileList);
      console.log('Imágenes generales seleccionadas:', this.imagenesGenerales.map(file => file.name).join(', '));
    }
  }

  onSubmit(): void {
    this.formSubmitted = true;
    this.responseMessage = '';
    if (this.tallerForm.valid) {
      this.isLoading = true;
      const taller: Taller = {
        nombre: this.tallerForm.get('nombre')?.value,
        descripcion: this.tallerForm.get('descripcion')?.value,
        competencia: this.tallerForm.get('competencia')?.value
      };

      const imagenPrincipal: File | undefined = this.imagenPrincipal ? this.imagenPrincipal : undefined;
      const imagenesGenerales: File[] | undefined = this.imagenesGenerales.length > 0 ? this.imagenesGenerales : undefined;

      this.tallerService.crearTaller(taller, imagenPrincipal, imagenesGenerales).subscribe({
        next: (response: any) => {
          console.log('Respuesta del servidor:', response);
          if (response && response.id) {
            this.responseMessage = `Taller creado con éxito. ID: ${response.id}`;
          } else {
            this.responseMessage = 'Taller creado, pero no se recibió un ID.';
          }
          this.resetForm();
        },
        error: (error: Error) => {
          console.error('Error al crear el taller', error);
          this.responseMessage = `Error al crear el taller: ${error.message}`;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      console.log('Formulario inválido', this.tallerForm);
      this.responseMessage = 'Por favor, complete todos los campos requeridos correctamente.';
    }
  }

  resetForm(): void {
    this.formSubmitted = false;
    this.tallerForm.reset();
    this.imagenPrincipal = null;
    this.imagenesGenerales = [];
    if (this.fileInputPrincipal && this.fileInputPrincipal.nativeElement) {
      this.fileInputPrincipal.nativeElement.value = '';
    }
    if (this.fileInputGenerales && this.fileInputGenerales.nativeElement) {
      this.fileInputGenerales.nativeElement.value = '';
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.tallerForm.get(fieldName);
    return !!(field && (field.invalid && (field.dirty || field.touched || this.formSubmitted)));
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
}
