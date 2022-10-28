import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaClientesRutaFacturasPageRoutingModule } from './lista-clientes-ruta-facturas-routing.module';

import { ListaClientesRutaFacturasPage } from './lista-clientes-ruta-facturas.page';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaClientesRutaFacturasPageRoutingModule,
    PipesModule
  ],
  declarations: [ListaClientesRutaFacturasPage]
})
export class ListaClientesRutaFacturasPageModule {}
