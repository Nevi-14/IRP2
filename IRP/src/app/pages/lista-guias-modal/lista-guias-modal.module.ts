import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaGuiasModalPageRoutingModule } from './lista-guias-modal-routing.module';

import { ListaGuiasModalPage } from './lista-guias-modal.page';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaGuiasModalPageRoutingModule,
    PipesModule
  ],
  declarations: [ListaGuiasModalPage]
})
export class ListaGuiasModalPageModule {}
