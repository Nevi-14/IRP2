import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ControlFacturasPageRoutingModule } from './control-facturas-routing.module';

import { ControlFacturasPage } from './control-facturas.page';
import { PipesModule } from 'src/app/pipes/pipes.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ControlFacturasPageRoutingModule,
    PipesModule
  ],
  declarations: [ControlFacturasPage]
})
export class ControlFacturasPageModule {}
