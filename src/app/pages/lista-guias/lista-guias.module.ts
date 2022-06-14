import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaGuiasPageRoutingModule } from './lista-guias-routing.module';

import { ListaGuiasPage } from './lista-guias.page';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaGuiasPageRoutingModule,
    PipesModule
  ],
  declarations: [ListaGuiasPage]
})
export class ListaGuiasPageModule {}
