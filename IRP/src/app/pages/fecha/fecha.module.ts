import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FechaPageRoutingModule } from './fecha-routing.module';

import { FechaPage } from './fecha.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FechaPageRoutingModule
  ],
  declarations: [FechaPage]
})
export class FechaPageModule {}
