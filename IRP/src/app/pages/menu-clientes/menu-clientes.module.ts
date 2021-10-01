import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuClientesPageRoutingModule } from './menu-clientes-routing.module';

import { MenuClientesPage } from './menu-clientes.page';
import { FiltroClientesPipe } from '../../pipes/filtro-clientes.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuClientesPageRoutingModule
  ],
  declarations: [MenuClientesPage, FiltroClientesPipe]
})
export class MenuClientesPageModule {}
