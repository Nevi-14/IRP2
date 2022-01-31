import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CamionesPageRoutingModule } from './camiones-routing.module';

import { CamionesPage } from './camiones.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CamionesPageRoutingModule
  ],
  declarations: [CamionesPage]
})
export class CamionesPageModule {}
