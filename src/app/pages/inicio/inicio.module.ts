import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { InicioPage } from './inicio.page';

import { InicioPageRoutingModule } from './inicio-routing.module';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InicioPageRoutingModule,
    PipesModule
  ],
  declarations: [InicioPage],

})
export class InicioPageModule {




}

