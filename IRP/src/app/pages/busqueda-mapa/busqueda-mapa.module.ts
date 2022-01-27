import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BusquedaMapaPageRoutingModule } from './busqueda-mapa-routing.module';

import { BusquedaMapaPage } from './busqueda-mapa.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BusquedaMapaPageRoutingModule,
    ComponentsModule,
    PipesModule
  ],
  declarations: [BusquedaMapaPage]
})
export class BusquedaMapaPageModule {}
