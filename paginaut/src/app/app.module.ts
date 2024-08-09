import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxMasonryModule } from 'ngx-masonry';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
registerLocaleData(localeEs, 'es');
// PrimeNG Modules
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';

import { FullCalendarModule } from '@fullcalendar/angular';

// Routing Module
import { AppRoutingModule } from './app-routing.module';

// Components
import { AppComponent } from './app.component';
import { PrincipalComponent } from './principal/principal.component';
import { CarrerasComponent } from './carreras/carreras.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ComponentesComponent } from './componentes/componentes.component';
import { FooterComponent } from './footer/footer.component';
import { UnidadesAcademicasComponent } from './unidades-academicas/unidades-academicas.component';
import { EventosComponent } from './eventos/eventos.component';
import { BecasComponent } from './becas/becas.component';
import { LoginComponent } from './login/login.component';
import { InfoCarreraComponent } from './info-carrera/info-carrera.component';
import { CalendarioComponent } from './calendario/calendario.component';
import { CursosComponent } from './cursos/cursos.component';
import { InfoCursoComponent } from './info-curso/info-curso.component';
import { InfoUnidadesComponent } from './info-unidades/info-unidades.component';
import { FilosofiaComponent } from './filosofia/filosofia.component';
import { AdmisionComponent } from './admision/admision.component';
import { InfoBolsaComponent } from './info-bolsa/info-bolsa.component';
import { InfoEnfermeriaComponent } from './info-enfermeria/info-enfermeria.component';
import { UbicacionComponent } from './ubicacion/ubicacion.component';
import { PsicologiaComponent } from './psicologia/psicologia.component';
import { CorreoComponent } from './correo/correo.component';
import { AcercaDeComponent } from './acerca-de/acerca-de.component';
import { InfoBecaComponent } from './info-beca/info-beca.component';
import { GaleriaComponent } from './galeria/galeria.component';
import { RedesSocialesComponent } from './redes-sociales/redes-sociales.component';
import { TalleresComponent } from './talleres/talleres.component';

// Rutas de administrador
import { NavbarAdminComponent } from './admin/navbar-admin/navbar-admin.component';
import { PrincipalAdminComponent } from './admin/principal-admin/principal-admin.component';
import { RegistrarEventoComponent } from './registrar-evento/registrar-evento.component';
import { AgregarDireccionComponent } from './agregar-direccion/agregar-direccion.component';
import { CarrerasAdminComponent } from './admin/carreras-admin/carreras-admin.component';
import { AgregarBecaComponent } from './admin/agregar-beca/agregar-beca.component';
import { AgregarCalendarioComponent } from './admin/agregar-calendario/agregar-calendario.component';
import { CursosAdminComponent } from './admin/cursos-admin/cursos-admin.component';
import { DireccionesAdminComponent } from './admin/direcciones-admin/direcciones-admin.component';
import { BecasAdminComponent } from './admin/becas-admin/becas-admin.component';
import { CalendarioAdminComponent } from './admin/calendario-admin/calendario-admin.component';
import { GaleriaAdminComponent } from './admin/galeria-admin/galeria-admin.component';
import { UsuariosAdminComponent } from './admin/usuarios-admin/usuarios-admin.component';
import { EventoComponent } from './admin/evento/evento.component';
import { EventosAdminComponent } from './admin/eventos-admin/eventos-admin.component';
import { NoticiasComponent } from './noticias/noticias.component';
import { NoticiaComponent } from './admin/noticia/noticia.component';
import { InstalacionComponent } from './admin/instalacion/instalacion.component';
import { AgendaAdminComponent } from './admin/agenda-admin/agenda-admin.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { PiedraEstanqueComponent } from './piedra-estanque/piedra-estanque.component';

// Info Carreras
import { CarreraAgrobiotecnologiaComponent } from './info-carreras/carrera-agrobiotecnologia/carrera-agrobiotecnologia.component';
import { CarreraProcesosAlimentarioComponent } from './info-carreras/carrera-procesos-alimentario/carrera-procesos-alimentario.component';
import { CarreraAcuiculturaComponent } from './info-carreras/carrera-acuicultura/carrera-acuicultura.component';
import { CarreraTurismoComponent } from './info-carreras/carrera-turismo/carrera-turismo.component';
import { CarreraAdministracionComponent } from './info-carreras/carrera-administracion/carrera-administracion.component';
import { CarreraMercadotecniaComponent } from './info-carreras/carrera-mercadotecnia/carrera-mercadotecnia.component';
import { CarreraGastronomiaComponent } from './info-carreras/carrera-gastronomia/carrera-gastronomia.component';
import { CarreraContaduriaComponent } from './info-carreras/carrera-contaduria/carrera-contaduria.component';
import { CarreraDesarrolloSoftwareComponent } from './info-carreras/carrera-desarrollo-software/carrera-desarrollo-software.component';

// Info Horas Recreativas
import { FutbolComponent } from './info-horas-recreativas/futbol/futbol.component';
import { BeisbolComponent } from './info-horas-recreativas/beisbol/beisbol.component';
import { BasquetbolComponent } from './info-horas-recreativas/basquetbol/basquetbol.component';
import { VoleibolComponent } from './info-horas-recreativas/voleibol/voleibol.component';
import { ActivacionFisicaComponent } from './info-horas-recreativas/activacion-fisica/activacion-fisica.component';
import { DibujoComponent } from './info-horas-recreativas/dibujo/dibujo.component';
import { DanzaComponent } from './info-horas-recreativas/danza/danza.component';
import { LecturaComponent } from './info-horas-recreativas/lectura/lectura.component';
import { AjedrezComponent } from './info-horas-recreativas/ajedrez/ajedrez.component';
import { TallerComponent } from './taller/taller.component';
import { AgregarCarreraComponent } from './admin/agregar-carrera/agregar-carrera.component';
import { LOCALE_ID } from '@angular/core';

@NgModule({

  declarations: [
    AppComponent,
    TallerComponent,
    PrincipalComponent,
    CarrerasComponent,
    NavbarComponent,
    ComponentesComponent,
    FooterComponent,
    TalleresComponent,
    UnidadesAcademicasComponent,
    EventosComponent,
    BecasComponent,
    LoginComponent,
    InfoCarreraComponent,
    CalendarioComponent,
    CursosComponent,
    InfoCursoComponent,
    InfoUnidadesComponent,
    FilosofiaComponent,
    AdmisionComponent,
    InfoBolsaComponent,
    InfoEnfermeriaComponent,
    UbicacionComponent,
    PsicologiaComponent,
    CorreoComponent,
    AcercaDeComponent,
    InfoBecaComponent,
    GaleriaComponent,
    RedesSocialesComponent,
    TalleresComponent,
    TallerComponent,
    // Rutas de administrador
    NavbarAdminComponent,
    PrincipalAdminComponent,
    RegistrarEventoComponent,
    AgregarDireccionComponent,
    CarrerasAdminComponent,
    AgregarBecaComponent,
    AgregarCalendarioComponent,
    CursosAdminComponent,
    DireccionesAdminComponent,
    BecasAdminComponent,
    CalendarioAdminComponent,
    GaleriaAdminComponent,
    UsuariosAdminComponent,
    EventoComponent,
    EventosAdminComponent,
    NoticiasComponent,
    NoticiaComponent,
    InstalacionComponent,
    AgendaAdminComponent,
    NotFoundComponent,
    PiedraEstanqueComponent,
    // Info Carreras
    CarreraAgrobiotecnologiaComponent,
    CarreraProcesosAlimentarioComponent,
    CarreraAcuiculturaComponent,
    CarreraTurismoComponent,
    CarreraAdministracionComponent,
    CarreraMercadotecniaComponent,
    CarreraGastronomiaComponent,
    CarreraContaduriaComponent,
    CarreraDesarrolloSoftwareComponent,
    // Info Horas Recreativas
    FutbolComponent,
    BeisbolComponent,
    BasquetbolComponent,
    VoleibolComponent,
    ActivacionFisicaComponent,
    DibujoComponent,
    DanzaComponent,
    LecturaComponent,
    AjedrezComponent,
    AgregarCarreraComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    TableModule,
    InputTextModule,
    TagModule,
    ButtonModule,
    DropdownModule,
    NgxMasonryModule,
    FullCalendarModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [{ provide: LOCALE_ID, useValue: 'es' }],
  bootstrap: [AppComponent],
})
export class AppModule {}
