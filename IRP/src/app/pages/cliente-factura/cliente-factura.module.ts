import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClienteFacturaPageRoutingModule } from './cliente-factura-routing.module';

import { ClienteFacturaPage } from './cliente-factura.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClienteFacturaPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ClienteFacturaPage]
})
export class ClienteFacturaPageModule {}
