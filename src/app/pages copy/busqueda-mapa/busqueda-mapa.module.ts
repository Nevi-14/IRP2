import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BusquedaMapaPageRoutingModule } from './busqueda-mapa-routing.module';

import { BusquedaMapaPage } from './busqueda-mapa.page';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BusquedaMapaPageRoutingModule,
    PipesModule,
    ComponentsModule
  ],
  declarations: [BusquedaMapaPage]
})
export class BusquedaMapaPageModule {}
