import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';

import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { PrincipalComponent } from './principal/principal.component';
import { CarrerasComponent } from './carreras/carreras.component';
import { InstalacionesComponent } from './instalaciones/instalaciones.component';


@NgModule({
  declarations: [
    AppComponent,
    PrincipalComponent,
    CarrerasComponent,
    InstalacionesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    TableModule,
    InputTextModule,
    TagModule,
    ButtonModule,
    FormsModule,
    DropdownModule
  ],
  providers: [],
  bootstrap: [AppComponent],

})
export class AppModule { }
