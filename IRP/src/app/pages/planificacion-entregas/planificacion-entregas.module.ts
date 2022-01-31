import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlanificacionEntregasPageRoutingModule } from './planificacion-entregas-routing.module';

import { PlanificacionEntregasPage } from './planificacion-entregas.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlanificacionEntregasPageRoutingModule,
    ComponentsModule
  ],
  declarations: [PlanificacionEntregasPage],
  exports:[]
})
export class PlanificacionEntregasPageModule {}
