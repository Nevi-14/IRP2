import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgregarActualizarCamionPageRoutingModule } from './agregar-actualizar-camion-routing.module';

import { AgregarActualizarCamionPage } from './agregar-actualizar-camion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgregarActualizarCamionPageRoutingModule
  ],
  declarations: [AgregarActualizarCamionPage]
})
export class AgregarActualizarCamionPageModule {}
