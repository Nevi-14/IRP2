import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlanificacionListaGuiasPageRoutingModule } from './planificacion-lista-guias-routing.module';

import { PlanificacionListaGuiasPage } from './planificacion-lista-guias.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlanificacionListaGuiasPageRoutingModule
  ],
  declarations: [PlanificacionListaGuiasPage]
})
export class PlanificacionListaGuiasPageModule {}
