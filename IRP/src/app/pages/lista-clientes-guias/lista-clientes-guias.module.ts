import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaClientesGuiasPageRoutingModule } from './lista-clientes-guias-routing.module';

import { ListaClientesGuiasPage } from './lista-clientes-guias.page';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaClientesGuiasPageRoutingModule,
    PipesModule
  ],
  declarations: [ListaClientesGuiasPage]
})
export class ListaClientesGuiasPageModule {}
