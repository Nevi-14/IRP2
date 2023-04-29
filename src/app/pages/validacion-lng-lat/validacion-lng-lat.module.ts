import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ValidacionLngLatPageRoutingModule } from './validacion-lng-lat-routing.module';

import { ValidacionLngLatPage } from './validacion-lng-lat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ValidacionLngLatPageRoutingModule
  ],
  declarations: [ValidacionLngLatPage]
})
export class ValidacionLngLatPageModule {}
