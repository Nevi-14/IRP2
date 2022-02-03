import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlanificacionEntregasPageRoutingModule } from './planificacion-entregas-routing.module';

import { PlanificacionEntregasPage } from './planificacion-entregas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlanificacionEntregasPageRoutingModule

  ],
  declarations: [PlanificacionEntregasPage]
})
export class PlanificacionEntregasPageModule {}
