import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MiniMapaComponent } from './mini-mapa/mini-mapa.component';
import { MapaComponent } from './mapa/mapa.component';
import { IonicModule } from '@ionic/angular';
import { PipesModule } from '../pipes/pipes.module';
import { HeaderComponent } from './header/header.component';



@NgModule({
  declarations: [MiniMapaComponent,MapaComponent,HeaderComponent],
  imports: [
    CommonModule,
    IonicModule,
    PipesModule
  ],
  exports: [
  MiniMapaComponent,MapaComponent,
  HeaderComponent

  ]
})
export class ComponentsModule { }
