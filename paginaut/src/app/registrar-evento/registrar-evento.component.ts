import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-registrar-evento',
  templateUrl: './registrar-evento.component.html',
  styleUrls: ['./registrar-evento.component.css']
})
export class RegistrarEventoComponent implements OnInit {
  eventForm: FormGroup;
  imagenPrincipal: File | null = null;
  imagenesAdicionales: File[] = [];
  archivos: File[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient) {
    // Inicializamos el formulario en el constructor
    this.eventForm = this.fb.group({
      titulo: ['', Validators.required],
      informacion_evento: ['', Validators.required],
      tipo: ['evento', Validators.required],
      lugar_evento: ['', Validators.required],
      fecha_inicio: [''],
      fecha_fin: [''],
      hora_inicio: [''],
      hora_fin: [''],
      activo: [true]
    });
  }

  ngOnInit() {
    this.eventForm.get('tipo')?.valueChanges.subscribe(tipo => {
      if (tipo === 'evento') {
        this.eventForm.get('fecha_inicio')?.setValidators(Validators.required);
        this.eventForm.get('fecha_fin')?.setValidators(Validators.required);
        this.eventForm.get('hora_inicio')?.setValidators(Validators.required);
        this.eventForm.get('hora_fin')?.setValidators(Validators.required);
      } else {
        this.eventForm.get('fecha_inicio')?.clearValidators();
        this.eventForm.get('fecha_fin')?.clearValidators();
        this.eventForm.get('hora_inicio')?.clearValidators();
        this.eventForm.get('hora_fin')?.clearValidators();
      }
      this.eventForm.get('fecha_inicio')?.updateValueAndValidity();
      this.eventForm.get('fecha_fin')?.updateValueAndValidity();
      this.eventForm.get('hora_inicio')?.updateValueAndValidity();
      this.eventForm.get('hora_fin')?.updateValueAndValidity();
    });
  }

  onImageSelected(event: Event, type: 'principal' | 'adicionales') {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    if (fileList) {
      if (type === 'principal') {
        this.imagenPrincipal = fileList[0];
      } else {
        this.imagenesAdicionales = Array.from(fileList);
      }
    }
  }

  onFileSelected(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    if (fileList) {
      this.archivos = Array.from(fileList);
    }
  }

  onSubmit() {
    if (this.eventForm.valid) {
      const formData = new FormData();
      Object.keys(this.eventForm.value).forEach(key => {
        formData.append(key, this.eventForm.get(key)?.value);
      });

      if (this.imagenPrincipal) {
        formData.append('imagen_principal', this.imagenPrincipal, this.imagenPrincipal.name);
      }

      this.imagenesAdicionales.forEach((img, index) => {
        formData.append(`imagen_adicional_${index}`, img, img.name);
      });

      this.archivos.forEach((file, index) => {
        formData.append(`archivo_${index}`, file, file.name);
      });

      this.http.post('/api/evento', formData).subscribe(
        response => {
          console.log('Evento registrado con éxito', response);
          // Aquí puedes agregar lógica adicional después de un registro exitoso
          // Por ejemplo, mostrar un mensaje de éxito o redirigir a otra página
        },
        error => {
          console.error('Error al registrar el evento', error);
          // Aquí puedes manejar los errores, por ejemplo mostrando un mensaje al usuario
        }
      );
    } else {
      // El formulario no es válido, muestra errores o realiza otras acciones
      console.log('Formulario inválido');
    }
  }
}