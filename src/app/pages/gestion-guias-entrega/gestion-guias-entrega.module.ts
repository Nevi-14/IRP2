import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GestionGuiasEntregaPageRoutingModule } from './gestion-guias-entrega-routing.module';

import { GestionGuiasEntregaPage } from './gestion-guias-entrega.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestionGuiasEntregaPageRoutingModule
  ],
  declarations: [GestionGuiasEntregaPage]
})
export class GestionGuiasEntregaPageModule {}
