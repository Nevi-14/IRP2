import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GuardarRutasPageRoutingModule } from './guardar-rutas-routing.module';

import { GuardarRutasPage } from './guardar-rutas.page';
import { ComponentsModule } from '../../components/components.module';
import { FiltroClientesPipe } from '../../pipes/filtro-clientes.pipe';
import { RutasPipe } from '../../pipes/rutas.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GuardarRutasPageRoutingModule,
    ComponentsModule
  ],
  declarations: [GuardarRutasPage, FiltroClientesPipe,RutasPipe]
})
export class GuardarRutasPageModule {}
