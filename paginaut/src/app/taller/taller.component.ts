import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TallerService, Taller } from '../taller.service';

@Component({
  selector: 'app-taller',
  templateUrl: './taller.component.html',
  styleUrls: ['./taller.component.css']
})
export class TallerComponent implements OnInit, AfterViewInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  tallerForm: FormGroup;
  imagen: File | null = null;
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
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.addEventListener('change', this.onFileChange.bind(this));
    } else {
      console.error('fileInput is null or undefined');
    }
  }

  onFileChange(event: Event): void {
    const element = event.target as HTMLInputElement;
    const fileList: FileList | null = element.files;
    if (fileList && fileList.length > 0) {
      this.imagen = fileList[0];
      console.log('Archivo seleccionado:', this.imagen.name);
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

      // Cambia esta línea
      this.tallerService.crearTaller(taller, this.imagen || undefined).subscribe({
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
    this.imagen = null;
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = '';
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
