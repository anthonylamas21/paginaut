import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrincipalComponent } from './principal/principal.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ComponentesComponent } from './componentes/componentes.component';
import { CarrerasComponent } from './carreras/carreras.component';
import { UnidadesAcademicasComponent } from './unidades-academicas/unidades-academicas.component';
import { BecasComponent } from './becas/becas.component';
import { TalleresComponent } from './talleres/talleres.component';
import { LoginComponent } from './login/login.component';
import { InfoCarreraComponent } from './info-carrera/info-carrera.component';
import { EventosComponent } from './eventos/eventos.component';
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

//Rutas Administrator
import { NavbarAdminComponent } from './admin/navbar-admin/navbar-admin.component';
import { PrincipalAdminComponent } from './admin/principal-admin/principal-admin.component';
import { CarrerasAdminComponent } from './admin/carreras-admin/carreras-admin.component';
import { CursosAdminComponent } from './admin/cursos-admin/cursos-admin.component';
import { DireccionesAdminComponent } from './admin/direcciones-admin/direcciones-admin.component';


//Info Carreras
import { CarreraAgrobiotecnologiaComponent } from './info-carreras/carrera-agrobiotecnologia/carrera-agrobiotecnologia.component';
import { CarreraProcesosAlimentarioComponent } from './info-carreras/carrera-procesos-alimentario/carrera-procesos-alimentario.component';
import { CarreraAcuiculturaComponent } from './info-carreras/carrera-acuicultura/carrera-acuicultura.component';
import { CarreraTurismoComponent } from './info-carreras/carrera-turismo/carrera-turismo.component';
import { CarreraAdministracionComponent } from './info-carreras/carrera-administracion/carrera-administracion.component';
import { CarreraMercadotecniaComponent } from './info-carreras/carrera-mercadotecnia/carrera-mercadotecnia.component';
import { CarreraGastronomiaComponent } from './info-carreras/carrera-gastronomia/carrera-gastronomia.component';
import { CarreraContaduriaComponent } from './info-carreras/carrera-contaduria/carrera-contaduria.component';
import { CarreraDesarrolloSoftwareComponent } from './info-carreras/carrera-desarrollo-software/carrera-desarrollo-software.component';

//Info Horas Recreativas
import { FutbolComponent } from './info-horas-recreativas/futbol/futbol.component';
import { BeisbolComponent } from './info-horas-recreativas/beisbol/beisbol.component';
import { BasquetbolComponent } from './info-horas-recreativas/basquetbol/basquetbol.component';
import { VoleibolComponent } from './info-horas-recreativas/voleibol/voleibol.component';
import { ActivacionFisicaComponent } from './info-horas-recreativas/activacion-fisica/activacion-fisica.component';
import { DibujoComponent } from './info-horas-recreativas/dibujo/dibujo.component';
import { DanzaComponent } from './info-horas-recreativas/danza/danza.component';
import { LecturaComponent } from './info-horas-recreativas/lectura/lectura.component';
import { AjedrezComponent } from './info-horas-recreativas/ajedrez/ajedrez.component';







const routes: Routes = [
  { path: '', redirectTo: '/principal', pathMatch: 'full' }, // Ruta por defecto
  { path: 'principal', component: PrincipalComponent }, 

  //Rutas 
  {path: 'principal', component: PrincipalComponent },
  {path: 'navbar', component: NavbarComponent },
  {path: 'componentes', component: ComponentesComponent},
  {path: 'carreras', component:CarrerasComponent},
  {path: 'becas', component:BecasComponent},
  {path: 'unidades_academicas', component:UnidadesAcademicasComponent},
  {path: 'lectura', component:TalleresComponent},
  {path: 'login', component:LoginComponent},
  {path: 'info_carrera', component:InfoCarreraComponent},
  {path: 'eventos', component:EventosComponent},
  {path: 'calendario', component:CalendarioComponent},
  {path: 'cursos', component:CursosComponent},
  {path: 'info_curso', component:InfoCursoComponent},
  {path: 'info_unidades', component: InfoUnidadesComponent},
  {path: 'filosofia', component: FilosofiaComponent},
  {path: 'admision', component: AdmisionComponent},
  {path: 'info_bolsa', component: InfoBolsaComponent},
  {path: 'info_enfermeria', component: InfoEnfermeriaComponent},
  {path: 'ubicacion', component: UbicacionComponent},
  {path: 'psicologia', component: PsicologiaComponent},
  {path: 'correo', component: CorreoComponent},
  {path: 'acerca_de', component: AcercaDeComponent},
  {path: 'info_becas', component:InfoBecaComponent},
  {path: 'galeria', component:GaleriaComponent},

  //Rutas Adminstrador
  {path: 'admin/navbar_admin', component: NavbarAdminComponent},
  {path: 'admin/principal_admin', component: PrincipalAdminComponent},
  {path: 'admin/carreras_admin', component: CarrerasAdminComponent},
  {path: 'admin/cursos_admin', component:CursosAdminComponent},
  {path: 'admin/direcciones_admin', component: DireccionesAdminComponent},
 
  //Info Carreras
  {path: 'info_carreras/agrobiotecnologia', component: CarreraAgrobiotecnologiaComponent},
  {path: 'info_carreras/procesos_alimentario', component: CarreraProcesosAlimentarioComponent},
  {path: 'info_carreras/acuicultura', component: CarreraAcuiculturaComponent},
  {path: 'info_carreras/turismo', component: CarreraTurismoComponent},
  {path: 'info_carreras/administracion', component: CarreraAdministracionComponent},
  {path: 'info_carreras/mercadotecnia', component: CarreraMercadotecniaComponent},
  {path: 'info_carreras/gastronomia', component: CarreraGastronomiaComponent},
  {path: 'info_carreras/contaduria', component: CarreraContaduriaComponent},
  {path: 'info_carreras/desarrollo_software', component: CarreraDesarrolloSoftwareComponent},

  //Info Horas Recreativas
  {path: 'info_horas_recreativas/futbol', component: FutbolComponent},
  {path: 'info_horas_recreativas/beisbol', component: BeisbolComponent},
  {path: 'info_horas_recreativas/basquetbol', component: BasquetbolComponent},
  {path: 'info_horas_recreativas/voleibol', component: VoleibolComponent},
  {path: 'info_horas_recreativas/activacion_fisica', component: ActivacionFisicaComponent},
  {path: 'info_horas_recreativas/dibujo', component: DibujoComponent},
  {path: 'info_horas_recreativas/danza', component: DanzaComponent},
  {path: 'info_horas_recreativas/lectura', component: LecturaComponent},
  {path: 'info_horas_recreativas/ajedrez', component: AjedrezComponent}


  
];

@NgModule({
  
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
 










