import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GuiaDetallesPageRoutingModule } from './guia-detalles-routing.module';

import { GuiaDetallesPage } from './guia-detalles.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GuiaDetallesPageRoutingModule
  ],
  declarations: [GuiaDetallesPage]
})
export class GuiaDetallesPageModule {}
