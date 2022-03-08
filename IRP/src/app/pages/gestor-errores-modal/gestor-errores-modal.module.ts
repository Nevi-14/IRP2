import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GestorErroresModalPageRoutingModule } from './gestor-errores-modal-routing.module';

import { GestorErroresModalPage } from './gestor-errores-modal.page';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestorErroresModalPageRoutingModule,
    PipesModule,
    DatePipe
  ],
  declarations: [GestorErroresModalPage]
})
export class GestorErroresModalPageModule {}
