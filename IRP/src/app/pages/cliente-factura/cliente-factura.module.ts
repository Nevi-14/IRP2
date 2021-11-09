import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClienteFacturaPageRoutingModule } from './cliente-factura-routing.module';

import { ClienteFacturaPage } from './cliente-factura.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClienteFacturaPageRoutingModule
  ],
  declarations: [ClienteFacturaPage]
})
export class ClienteFacturaPageModule {}
