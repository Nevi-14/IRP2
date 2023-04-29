import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';



import { PlanificacionRutasPage } from './planificacion-rutas.page';
import { PlanificacionPageRoutingModule } from './planificacion-rutas-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlanificacionPageRoutingModule,
    ComponentsModule
  ],
  declarations: [PlanificacionRutasPage]
})
export class PlanificacionRutasPageModule {}
