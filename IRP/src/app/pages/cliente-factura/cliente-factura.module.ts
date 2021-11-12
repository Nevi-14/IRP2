import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
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
  declarations: [ClienteFacturaPage,DatePipe]
})
export class ClienteFacturaPageModule {}
