import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaCamionesModalPageRoutingModule } from './lista-camiones-modal-routing.module';

import { ListaCamionesModalPage } from './lista-camiones-modal.page';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaCamionesModalPageRoutingModule,
    PipesModule
  ],
  declarations: [ListaCamionesModalPage]
})
export class ListaCamionesModalPageModule {}
