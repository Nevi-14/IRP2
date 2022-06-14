import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GestionLiquidacionesPageRoutingModule } from './gestion-liquidaciones-routing.module';

import { GestionLiquidacionesPage } from './gestion-liquidaciones.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestionLiquidacionesPageRoutingModule
  ],
  declarations: [GestionLiquidacionesPage]
})
export class GestionLiquidacionesPageModule {}
