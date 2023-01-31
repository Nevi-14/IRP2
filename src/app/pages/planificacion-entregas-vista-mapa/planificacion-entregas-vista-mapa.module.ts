import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlanificacionEntregasVistaMapaPageRoutingModule } from './planificacion-entregas-vista-mapa-routing.module';

import { PlanificacionEntregasVistaMapaPage } from './planificacion-entregas-vista-mapa.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlanificacionEntregasVistaMapaPageRoutingModule
  ],
  declarations: [PlanificacionEntregasVistaMapaPage]
})
export class PlanificacionEntregasVistaMapaPageModule {}
