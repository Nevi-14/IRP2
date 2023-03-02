import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GestionTelefonosPageRoutingModule } from './gestion-telefonos-routing.module';

import { GestionTelefonosPage } from './gestion-telefonos.page';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestionTelefonosPageRoutingModule,
    PipesModule
  ],
  declarations: [GestionTelefonosPage]
})
export class GestionTelefonosPageModule {}
