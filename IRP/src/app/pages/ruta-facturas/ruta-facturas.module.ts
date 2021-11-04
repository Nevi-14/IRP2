import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RutaFacturasPageRoutingModule } from './ruta-facturas-routing.module';

import { RutaFacturasPage } from './ruta-facturas.page';
import { ComponentsModule } from '../../components/components.module';
import { RutasPipe } from 'src/app/pipes/rutas.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RutaFacturasPageRoutingModule,
    ComponentsModule
  ],
  declarations: [RutaFacturasPage,RutasPipe]
})
export class RutaFacturasPageModule {}
