import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GuiasRutaPageRoutingModule } from './guias-ruta-routing.module';

import { GuiasRutaPage } from './guias-ruta.page';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GuiasRutaPageRoutingModule,
    PipesModule
  ],
  declarations: [GuiasRutaPage]
})
export class GuiasRutaPageModule {}
