import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalleClientesPageRoutingModule } from './detalle-clientes-routing.module';

import { DetalleClientesPage } from './detalle-clientes.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleClientesPageRoutingModule,
    ComponentsModule
  ],
  declarations: [DetalleClientesPage]
})
export class DetalleClientesPageModule {}
