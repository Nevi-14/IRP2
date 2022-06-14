import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlanificacionEntregasPageRoutingModule } from './planificacion-entregas-routing.module';

import { PlanificacionEntregasPage } from './planificacion-entregas.page';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlanificacionEntregasPageRoutingModule,
    PipesModule


  ],
  declarations: [PlanificacionEntregasPage]
})
export class PlanificacionEntregasPageModule {}
