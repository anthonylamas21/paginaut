import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DireccionService, Direccion } from '../direccion.service';

@Component({
  selector: 'app-agregar-direccion',
  templateUrl: './agregar-direccion.component.html',
  styleUrls: ['./agregar-direccion.component.css']
})
export class AgregarDireccionComponent implements OnInit {
  direccionForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private direccionService: DireccionService
  ) {
    this.direccionForm = this.fb.group({
      abreviatura: ['', [Validators.required, Validators.maxLength(10)]],
      nombre: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.direccionForm.valid) {
      const direccionData: Direccion = this.direccionForm.value;
      this.direccionService.agregarDireccion(direccionData).subscribe({
        next: (response) => {
          console.log('Dirección agregada con éxito', response);
          this.successMessage = 'Dirección agregada correctamente';
          this.resetForm();
        },
        error: (error) => {
          console.error('Error al agregar la dirección', error);
          this.errorMessage = error.message;
        }
      });
    } else {
      this.errorMessage = 'Por favor, completa todos los campos requeridos.';
    }
  }

  resetForm() {
    this.direccionForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
  }
}