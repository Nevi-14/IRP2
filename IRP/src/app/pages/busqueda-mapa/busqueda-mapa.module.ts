import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BusquedaMapaPageRoutingModule } from './busqueda-mapa-routing.module';

import { BusquedaMapaPage } from './busqueda-mapa.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BusquedaMapaPageRoutingModule
  ],
  declarations: [BusquedaMapaPage]
})
export class BusquedaMapaPageModule {}
