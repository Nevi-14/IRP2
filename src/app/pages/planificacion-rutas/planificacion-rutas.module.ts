import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';



import { PlanificacionRutasPage } from './planificacion-rutas.page';
import { PlanificacionPageRoutingModule } from './planificacion-rutas-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlanificacionPageRoutingModule
  ],
  declarations: [PlanificacionRutasPage]
})
export class PlanificacionRutasPageModule {}
