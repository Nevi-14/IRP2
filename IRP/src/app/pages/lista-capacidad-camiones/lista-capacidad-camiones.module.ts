import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaCapacidadCamionesPageRoutingModule } from './lista-capacidad-camiones-routing.module';

import { ListaCapacidadCamionesPage } from './lista-capacidad-camiones.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaCapacidadCamionesPageRoutingModule
  ],
  declarations: [ListaCapacidadCamionesPage]
})
export class ListaCapacidadCamionesPageModule {}
