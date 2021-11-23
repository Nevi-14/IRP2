import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfiguracionMapaPageRoutingModule } from './configuracion-mapa-routing.module';

import { ConfiguracionMapaPage } from './configuracion-mapa.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfiguracionMapaPageRoutingModule
  ],
  declarations: [ConfiguracionMapaPage]
})
export class ConfiguracionMapaPageModule {}
