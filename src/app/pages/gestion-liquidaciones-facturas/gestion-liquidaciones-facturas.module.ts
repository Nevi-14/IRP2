import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GestionLiquidacionesFacturasPageRoutingModule } from './gestion-liquidaciones-facturas-routing.module';

import { GestionLiquidacionesFacturasPage } from './gestion-liquidaciones-facturas.page';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestionLiquidacionesFacturasPageRoutingModule,
    PipesModule
  ],
  declarations: [GestionLiquidacionesFacturasPage]
})
export class GestionLiquidacionesFacturasPageModule {}
