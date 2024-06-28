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
import { NavbarComponent } from './navbar/navbar.component';
import { ComponentesComponent } from './componentes/componentes.component';
import { FooterComponent } from './footer/footer.component';
import { UnidadesAcademicasComponent } from './unidades-academicas/unidades-academicas.component';
import { EventosComponent } from './eventos/eventos.component';
import { BecasComponent } from './becas/becas.component';
import { TalleresComponent } from './talleres/talleres.component';
import { LoginComponent } from './login/login.component';
import { InfoCarreraComponent } from './info-carrera/info-carrera.component';
import { CalendarioComponent } from './calendario/calendario.component';
import { PrincipalAdminComponent } from './admin/principal-admin/principal-admin.component';
import { InfoBecaComponent } from './info-beca/info-beca.component';



@NgModule({
  declarations: [
    AppComponent,
    PrincipalComponent,
    CarrerasComponent,
    InstalacionesComponent,
    NavbarComponent,
    ComponentesComponent,
    FooterComponent,
    UnidadesAcademicasComponent,
    EventosComponent,
    BecasComponent,
    LoginComponent,
    InfoCarreraComponent,
    CalendarioComponent,
    PrincipalAdminComponent,
    InfoBecaComponent,
    TalleresComponent
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
