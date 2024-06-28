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
  {path: 'info_enfermeria', component: InfoEnfermeriaComponent}
];

@NgModule({
  
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
 










