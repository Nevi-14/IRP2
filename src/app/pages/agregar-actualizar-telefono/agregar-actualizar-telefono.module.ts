import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgregarActualizarTelefonoPageRoutingModule } from './agregar-actualizar-telefono-routing.module';

import { AgregarActualizarTelefonoPage } from './agregar-actualizar-telefono.page';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgregarActualizarTelefonoPageRoutingModule,
    PipesModule
  ],
  declarations: [AgregarActualizarTelefonoPage]
})
export class AgregarActualizarTelefonoPageModule {}
