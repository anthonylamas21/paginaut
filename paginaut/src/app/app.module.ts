import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxMasonryModule } from 'ngx-masonry';

// PrimeNG Modules
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';

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
import { TalleresComponent } from './talleres/talleres.component';
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

// Rutas de administrador
import { NavbarAdminComponent } from './admin/navbar-admin/navbar-admin.component';
import { PrincipalAdminComponent } from './admin/principal-admin/principal-admin.component';
import { RegistrarEventoComponent } from './registrar-evento/registrar-evento.component';
import { AgregarDireccionComponent } from './agregar-direccion/agregar-direccion.component';
import { TallerComponent } from './taller/taller.component';
import { CarrerasAdminComponent } from './admin/carreras-admin/carreras-admin.component';
import { AgregarCalendarioComponent } from './admin/agregar-calendario/agregar-calendario.component';
import { AgregarBecaComponent } from './admin/agregar-beca/agregar-beca.component';
import { CursosAdminComponent } from './admin/cursos-admin/cursos-admin.component';
import { DireccionesAdminComponent } from './admin/direcciones-admin/direcciones-admin.component';
import { BecasAdminComponent } from './admin/becas-admin/becas-admin.component';
import { CalendarioAdminComponent } from './admin/calendario-admin/calendario-admin.component';
import { GaleriaAdminComponent } from './admin/galeria-admin/galeria-admin.component';
import { UsuariosAdminComponent } from './admin/usuarios-admin/usuarios-admin.component';

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
import { AcercaDeComponent } from './acerca-de/acerca-de.component';
import { EventoComponent } from './admin/evento/evento.component';
import { EventosAdminComponent } from './admin/eventos-admin/eventos-admin.component'; //Pendiende de ruta
import { BecasAdminComponent } from './admin/becas-admin/becas-admin.component';
import { CalendarioAdminComponent } from './admin/calendario-admin/calendario-admin.component';
import { GaleriaAdminComponent } from './admin/galeria-admin/galeria-admin.component';
import { UsuariosAdminComponent } from './admin/usuarios-admin/usuarios-admin.component';
import { NoticiasComponent } from './noticias/noticias.component';
import { NoticiaComponent } from './admin/noticia/noticia.component';




@NgModule({
  declarations: [
    AppComponent,
    PrincipalComponent,
    CarrerasComponent,
    NavbarComponent,
    ComponentesComponent,
    FooterComponent,
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
    // Rutas de administrador
    NavbarAdminComponent,
    PrincipalAdminComponent,
    RegistrarEventoComponent,
    AgregarDireccionComponent,
    TallerComponent,
    CarrerasAdminComponent,
    AgregarCalendarioComponent,
    AgregarBecaComponent,
    CursosAdminComponent,
    DireccionesAdminComponent,
    BecasAdminComponent,
    CalendarioAdminComponent,
    GaleriaAdminComponent,
    UsuariosAdminComponent,
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
    AcercaDeComponent,
    InfoBecaComponent,
    TalleresComponent,
    RedesSocialesComponent,
    GaleriaComponent,
    EventoComponent,
    NoticiasComponent,
    NoticiaComponent,
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
    NgxMasonryModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
