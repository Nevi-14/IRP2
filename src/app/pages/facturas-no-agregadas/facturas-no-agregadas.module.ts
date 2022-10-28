import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FacturasNoAgregadasPageRoutingModule } from './facturas-no-agregadas-routing.module';

import { FacturasNoAgregadasPage } from './facturas-no-agregadas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FacturasNoAgregadasPageRoutingModule
  ],
  declarations: [FacturasNoAgregadasPage]
})
export class FacturasNoAgregadasPageModule {}
