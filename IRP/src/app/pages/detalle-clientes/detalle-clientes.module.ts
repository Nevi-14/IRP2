import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalleClientesPageRoutingModule } from './detalle-clientes-routing.module';

import { DetalleClientesPage } from './detalle-clientes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleClientesPageRoutingModule
  ],
  declarations: [DetalleClientesPage]
})
export class DetalleClientesPageModule {}
