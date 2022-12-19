import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlanificacionEntregaClienteDetallePageRoutingModule } from './planificacion-entrega-cliente-detalle-routing.module';

import { PlanificacionEntregaClienteDetallePage } from './planificacion-entrega-cliente-detalle.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlanificacionEntregaClienteDetallePageRoutingModule,
    ComponentsModule,
    PipesModule
  ],
  declarations: [PlanificacionEntregaClienteDetallePage]
})
export class PlanificacionEntregaClienteDetallePageModule {}
