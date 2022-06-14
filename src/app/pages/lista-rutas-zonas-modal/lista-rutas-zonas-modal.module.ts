import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaRutasZonasModalPageRoutingModule } from './lista-rutas-zonas-modal-routing.module';

import { ListaRutasZonasModalPage } from './lista-rutas-zonas-modal.page';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaRutasZonasModalPageRoutingModule,
    PipesModule
  ],
  declarations: [ListaRutasZonasModalPage]
})
export class ListaRutasZonasModalPageModule {}
