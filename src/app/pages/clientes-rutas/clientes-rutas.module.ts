import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientesRutasPageRoutingModule } from './clientes-rutas-routing.module';

import { ClientesRutasPage } from './clientes-rutas.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientesRutasPageRoutingModule,
    ComponentsModule,
    PipesModule
  ],
  declarations: [ClientesRutasPage]
})
export class ClientesRutasPageModule {}
