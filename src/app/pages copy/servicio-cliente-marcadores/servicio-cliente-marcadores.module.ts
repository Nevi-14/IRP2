import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServicioClienteMarcadoresPageRoutingModule } from './servicio-cliente-marcadores-routing.module';

import { ServicioClienteMarcadoresPage } from './servicio-cliente-marcadores.page';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServicioClienteMarcadoresPageRoutingModule,
    PipesModule
  ],
  declarations: [ServicioClienteMarcadoresPage]
})
export class ServicioClienteMarcadoresPageModule {}
