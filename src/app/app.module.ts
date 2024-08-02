import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConocenosComponent } from './conocenos/conocenos.component';
import { PlanComponent } from './plan/plan.component';
import { SalalecturaComponent } from './salalectura/salalectura.component';
import { BolsadetrabajoComponent } from './bolsadetrabajo/bolsadetrabajo.component';
import { TransparenciaComponent } from './transparencia/transparencia.component';
import { PrincipalComponent } from './principal/principal.component';
import { AgregarCarreraComponent } from './admin/agregar-carrera/agregar-carrera.component';

@NgModule({
  declarations: [
    AppComponent,
    ConocenosComponent,
    PlanComponent,
    SalalecturaComponent,
    BolsadetrabajoComponent,
    TransparenciaComponent,
    PrincipalComponent,
    AgregarCarreraComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }