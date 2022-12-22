import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlanificacionEntregaClientesPageRoutingModule } from './planificacion-entrega-clientes-routing.module';

import { PlanificacionEntregaClientesPage } from './planificacion-entrega-clientes.page';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlanificacionEntregaClientesPageRoutingModule,
    PipesModule
  ],
  declarations: [PlanificacionEntregaClientesPage]
})
export class PlanificacionEntregaClientesPageModule {}
