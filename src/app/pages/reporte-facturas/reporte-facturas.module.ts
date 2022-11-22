import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReporteFacturasPageRoutingModule } from './reporte-facturas-routing.module';

import { ReporteFacturasPage } from './reporte-facturas.page';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReporteFacturasPageRoutingModule,
    PipesModule
  ],
  declarations: [ReporteFacturasPage]
})
export class ReporteFacturasPageModule {}
