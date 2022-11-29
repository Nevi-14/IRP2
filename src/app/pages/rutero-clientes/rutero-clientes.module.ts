import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RuteroClientesPageRoutingModule } from './rutero-clientes-routing.module';

import { RuteroClientesPage } from './rutero-clientes.page';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RuteroClientesPageRoutingModule,
    PipesModule
  ],
  declarations: [RuteroClientesPage]
})
export class RuteroClientesPageModule {}
