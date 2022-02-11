import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaGuiasPageRoutingModule } from './lista-guias-routing.module';

import { ListaGuiasPage } from './lista-guias.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaGuiasPageRoutingModule
  ],
  declarations: [ListaGuiasPage]
})
export class ListaGuiasPageModule {}
