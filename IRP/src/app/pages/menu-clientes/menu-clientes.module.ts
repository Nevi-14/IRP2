import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuClientesPageRoutingModule } from './menu-clientes-routing.module';

import { MenuClientesPage } from './menu-clientes.page';
import { FiltroClientesPipe } from '../../pipes/filtro-clientes.pipe';
import { FiltroPipe } from '../../pipes/filtro.pipe';
import { RutasPipe } from '../../pipes/rutas.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuClientesPageRoutingModule
  ],
  declarations: [MenuClientesPage, FiltroClientesPipe, FiltroPipe, RutasPipe]
})
export class MenuClientesPageModule {}
