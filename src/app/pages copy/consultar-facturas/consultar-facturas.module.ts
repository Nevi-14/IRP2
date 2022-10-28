import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConsultarFacturasPageRoutingModule } from './consultar-facturas-routing.module';

import { ConsultarFacturasPage } from './consultar-facturas.page';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConsultarFacturasPageRoutingModule,
    PipesModule
  ],
  declarations: [ConsultarFacturasPage]
})
export class ConsultarFacturasPageModule {}
